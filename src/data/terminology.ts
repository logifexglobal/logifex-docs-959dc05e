export type Layer = 'core' | 'plugin' | 'ui' | 'tooling' | 'meta';
export type Knowledge = 'mandatory' | 'optional' | 'advanced';
export type Status = 'stable' | 'beta' | 'deprecated';

export interface Term {
  id: string;
  name: string;
  layer: Layer;
  knowledge: Knowledge;
  status: Status;
  version: string;
  oneLine: string;
  mentalModel: string;
  whyNeeded: string;
  guarantees: string[];
  antiPatterns: string[];
  relationships: { termId: string; relation: string }[];
  notThis: string[];
  lifecycle?: string;
  example?: string;
  futureEvolution?: string;
}

export const layerInfo: Record<Layer, { label: string; description: string }> = {
  core: {
    label: 'Core',
    description: 'Foundational concepts that define the runtime behavior of Logifex',
  },
  plugin: {
    label: 'Plugin',
    description: 'Extension mechanisms and plugin architecture concepts',
  },
  ui: {
    label: 'UI',
    description: 'User interface, theming, and visual component concepts',
  },
  tooling: {
    label: 'Tooling',
    description: 'Developer tools, debugging, and observability concepts',
  },
  meta: {
    label: 'Meta',
    description: 'Governance, compatibility, and ecosystem management concepts',
  },
};

export const knowledgeInfo: Record<Knowledge, { label: string; description: string }> = {
  mandatory: {
    label: 'Mandatory',
    description: 'Must understand before using Logifex',
  },
  optional: {
    label: 'Optional',
    description: 'Useful for common use cases',
  },
  advanced: {
    label: 'Advanced',
    description: 'For architects and power users',
  },
};

export const terminology: Term[] = [
  {
    id: 'core',
    name: 'Core',
    layer: 'core',
    knowledge: 'mandatory',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'The minimal, immutable runtime kernel that orchestrates all system behaviors.',
    mentalModel: 'Think of Core as the beating heart of Logifex. It is the smallest possible piece of code that must exist for the system to function. Everything else—plugins, adapters, UI—attaches to Core, but Core never depends on them.',
    whyNeeded: 'Without a defined Core, there is no guarantee of stability across versions. The Core provides the contract that the entire ecosystem builds upon. It ensures that upgrading plugins or adapters never breaks fundamental behavior.',
    guarantees: [
      'Core APIs are backwards-compatible within major versions',
      'Core never imports from plugin, UI, or adapter layers',
      'Core exposes only what is necessary; internals are hidden',
    ],
    antiPatterns: [
      'Putting business logic directly in Core',
      'Accessing Core internals instead of using public APIs',
      'Assuming Core will handle domain-specific behaviors',
    ],
    relationships: [
      { termId: 'event', relation: 'emits and processes' },
      { termId: 'event-bus', relation: 'uses internally' },
      { termId: 'lifecycle', relation: 'defines phases' },
      { termId: 'registry', relation: 'manages' },
    ],
    notThis: [
      'Not a plugin—plugins extend Core, Core does not extend itself',
      'Not a framework—Logifex is a framework, Core is its kernel',
    ],
    lifecycle: 'Core initializes first, before any plugins. It remains active until the system shuts down. Core version changes trigger major version bumps.',
    example: 'When your application starts, Core boots up, initializes the Event Bus, and signals that the system is ready. Plugins then register themselves through Core\'s public registration API.',
    futureEvolution: 'Future versions may introduce Core Modes (strict, permissive) to support different runtime guarantees.',
  },
  {
    id: 'event',
    name: 'Event',
    layer: 'core',
    knowledge: 'mandatory',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'An immutable, typed payload that represents something that happened in the system.',
    mentalModel: 'An Event is a fact. It describes what occurred, not what should happen. Events flow through the system like ripples in water—they cannot be stopped or changed once emitted, only observed and reacted to.',
    whyNeeded: 'Events decouple the "what happened" from the "what to do about it." This separation allows plugins and handlers to react independently without knowing about each other. It makes the system extensible and testable.',
    guarantees: [
      'Events are immutable once created',
      'Events have a defined schema (type, payload, metadata)',
      'Events are delivered in order within a single source',
    ],
    antiPatterns: [
      'Mutating an event after emission',
      'Using events for commands (use Commands instead)',
      'Creating events without a clear "something happened" semantic',
    ],
    relationships: [
      { termId: 'event-bus', relation: 'travels through' },
      { termId: 'handler', relation: 'processed by' },
      { termId: 'contract', relation: 'defined by' },
    ],
    notThis: [
      'Not a Command—Commands request action, Events report facts',
      'Not a State—Events are temporal, State is persistent',
    ],
    example: 'UserLoggedIn { userId: "abc", timestamp: 1234567890 } is an Event. It states what happened. A Handler might react by updating analytics or sending a welcome notification.',
  },
  {
    id: 'event-bus',
    name: 'Event Bus',
    layer: 'core',
    knowledge: 'mandatory',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'The central channel through which all Events flow between producers and consumers.',
    mentalModel: 'The Event Bus is like a postal system. Events are letters dropped into the system. The Bus ensures they reach all registered recipients without the sender needing to know who they are.',
    whyNeeded: 'Without a centralized bus, components would need direct references to each other, creating tight coupling. The Event Bus enables a publish-subscribe architecture where components communicate through contracts, not references.',
    guarantees: [
      'Events published to the bus reach all active subscribers',
      'Subscription order does not affect delivery semantics',
      'The bus handles backpressure gracefully',
    ],
    antiPatterns: [
      'Bypassing the bus for "performance" (breaks contracts)',
      'Using the bus for synchronous request-response patterns',
      'Subscribing to events without proper cleanup',
    ],
    relationships: [
      { termId: 'event', relation: 'transports' },
      { termId: 'handler', relation: 'delivers to' },
      { termId: 'core', relation: 'managed by' },
    ],
    notThis: [
      'Not a message queue—there is no persistence guarantee',
      'Not an RPC mechanism—events are fire-and-forget',
    ],
  },
  {
    id: 'handler',
    name: 'Handler',
    layer: 'core',
    knowledge: 'mandatory',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A function that reacts to a specific Event type and performs side effects or state changes.',
    mentalModel: 'A Handler is a listener with purpose. When a specific type of Event arrives, the Handler springs into action. It is the "then" in "when X happens, then do Y."',
    whyNeeded: 'Handlers provide the extension points where business logic lives. By separating event emission from reaction, the system allows multiple independent behaviors to respond to the same event.',
    guarantees: [
      'Handlers are invoked for matching event types only',
      'Handler errors are isolated—one failure does not stop others',
      'Handlers can be registered and unregistered at runtime',
    ],
    antiPatterns: [
      'Handlers that modify the event they receive',
      'Handlers with hidden dependencies on execution order',
      'Synchronous handlers that block the event bus',
    ],
    relationships: [
      { termId: 'event', relation: 'processes' },
      { termId: 'event-bus', relation: 'subscribed to' },
      { termId: 'contract', relation: 'implements' },
    ],
    notThis: [
      'Not a Controller—Handlers react, they do not initiate',
      'Not middleware—Handlers do not transform the event pipeline',
    ],
  },
  {
    id: 'contract',
    name: 'Contract',
    layer: 'core',
    knowledge: 'mandatory',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A formal specification of the shape, behavior, and guarantees of an interface.',
    mentalModel: 'A Contract is a promise in code. It declares: "If you give me this, I will give you that." Contracts are the boundaries between components, ensuring they can evolve independently as long as the contract holds.',
    whyNeeded: 'Contracts make implicit assumptions explicit. They enable static analysis, runtime validation, and documentation generation. Without contracts, integration becomes guesswork.',
    guarantees: [
      'Contracts are versioned and immutable within a version',
      'Breaking a contract requires a new major version',
      'Contracts can be validated at compile-time and runtime',
    ],
    antiPatterns: [
      'Undocumented contracts (implicit interfaces)',
      'Contracts that change frequently',
      'Contracts that expose implementation details',
    ],
    relationships: [
      { termId: 'event', relation: 'defines schema for' },
      { termId: 'handler', relation: 'constrains' },
      { termId: 'adapter', relation: 'specifies interface for' },
      { termId: 'validation-engine', relation: 'enforced by' },
    ],
    notThis: [
      'Not documentation—Contracts are machine-readable specifications',
      'Not types alone—Contracts include behavioral guarantees',
    ],
  },
  {
    id: 'adapter',
    name: 'Adapter',
    layer: 'plugin',
    knowledge: 'mandatory',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A boundary component that translates between Logifex internals and external systems.',
    mentalModel: 'An Adapter is a translator. It speaks Logifex on one side and another language (React, REST API, database) on the other. Adapters ensure that Core remains pure while the system integrates with the outside world.',
    whyNeeded: 'Logifex must integrate with diverse technologies without coupling to any of them. Adapters provide isolation—if React is replaced with Vue, only the React adapter changes.',
    guarantees: [
      'Adapters implement a defined Contract',
      'Adapters handle errors gracefully without crashing Core',
      'Multiple adapters of the same type can coexist',
    ],
    antiPatterns: [
      'Adapters that leak external concepts into Core',
      'Business logic in adapters instead of handlers',
      'Adapters that bypass the Event Bus',
    ],
    relationships: [
      { termId: 'contract', relation: 'implements' },
      { termId: 'core', relation: 'integrates with' },
      { termId: 'state-adapter', relation: 'specialized form' },
    ],
    notThis: [
      'Not a Plugin—Plugins add features, Adapters translate boundaries',
      'Not middleware—Adapters do not sit in the event pipeline',
    ],
  },
  {
    id: 'lifecycle',
    name: 'Lifecycle',
    layer: 'core',
    knowledge: 'mandatory',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'The defined phases a component goes through from creation to destruction.',
    mentalModel: 'Lifecycle is the biography of a component. Birth, growth, activity, decline, death. Understanding lifecycle means knowing when to initialize resources, when to react to changes, and when to clean up.',
    whyNeeded: 'Without explicit lifecycle phases, resource management becomes ad-hoc. Memory leaks, dangling subscriptions, and initialization races emerge. Lifecycle provides hooks for deterministic setup and teardown.',
    guarantees: [
      'Lifecycle phases execute in defined order',
      'Cleanup hooks are always called, even on error',
      'Components cannot skip lifecycle phases',
    ],
    antiPatterns: [
      'Performing side effects outside lifecycle hooks',
      'Ignoring cleanup in unmount phase',
      'Assuming lifecycle timing without consulting docs',
    ],
    relationships: [
      { termId: 'core', relation: 'defined by' },
      { termId: 'plugin', relation: 'governs' },
      { termId: 'handler', relation: 'scopes' },
    ],
    notThis: [
      'Not a state machine—Lifecycle is linear, not branching',
      'Not optional—every component has a lifecycle',
    ],
  },
  {
    id: 'mode',
    name: 'Mode',
    layer: 'core',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A runtime configuration that alters system behavior without changing code.',
    mentalModel: 'Modes are like gears in a car. Development mode prioritizes debugging and verbose logging. Production mode prioritizes performance and security. Same engine, different tuning.',
    whyNeeded: 'Different contexts require different tradeoffs. Modes allow the same codebase to behave appropriately in development, testing, staging, and production without conditional logic scattered throughout.',
    guarantees: [
      'Mode is set once at startup and remains constant',
      'Mode-specific behavior is documented per component',
      'Unknown modes fall back to a safe default',
    ],
    antiPatterns: [
      'Changing mode at runtime',
      'Mode-specific business logic (use feature flags instead)',
      'Undocumented mode behaviors',
    ],
    relationships: [
      { termId: 'core', relation: 'configured in' },
      { termId: 'devtools', relation: 'enables' },
      { termId: 'telemetry', relation: 'affects verbosity of' },
    ],
    notThis: [
      'Not a feature flag—Modes are environment-level, not feature-level',
      'Not configurable per-user—Modes are system-wide',
    ],
  },
  {
    id: 'plugin',
    name: 'Plugin',
    layer: 'plugin',
    knowledge: 'mandatory',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A self-contained module that extends Logifex capabilities through defined extension points.',
    mentalModel: 'A Plugin is a guest in the Logifex house. It follows house rules (Extension Points), brings its own furniture (handlers, adapters), and can be asked to leave (unloaded) without damaging the house.',
    whyNeeded: 'Plugins enable ecosystem growth without bloating Core. They allow third-party developers to add features, integrate services, and customize behavior while maintaining system stability.',
    guarantees: [
      'Plugins cannot modify Core internals',
      'Plugins are isolated—one plugin\'s failure does not crash others',
      'Plugins declare their dependencies explicitly',
    ],
    antiPatterns: [
      'Plugins that monkey-patch Core',
      'Plugins with circular dependencies',
      'Plugins that assume execution order',
    ],
    relationships: [
      { termId: 'extension-point', relation: 'attaches to' },
      { termId: 'registry', relation: 'registered in' },
      { termId: 'capability', relation: 'declares' },
      { termId: 'lifecycle', relation: 'follows' },
    ],
    notThis: [
      'Not an Adapter—Plugins add features, Adapters translate boundaries',
      'Not Core—Plugins are optional, Core is required',
    ],
  },
  {
    id: 'extension-point',
    name: 'Extension Point',
    layer: 'plugin',
    knowledge: 'mandatory',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A defined location in the system where plugins can attach behavior.',
    mentalModel: 'Extension Points are designated parking spots. Plugins can only park where spots exist. This prevents chaos—you cannot extend arbitrary internals, only the places Logifex explicitly allows.',
    whyNeeded: 'Unrestricted extension leads to fragile systems. Extension Points create a controlled surface area for customization, making upgrades safer and behavior predictable.',
    guarantees: [
      'Extension Points are versioned with the API they belong to',
      'Removing an Extension Point requires a major version bump',
      'Extension Points document what inputs they receive and what outputs they expect',
    ],
    antiPatterns: [
      'Creating extension points for every function',
      'Extension points without validation',
      'Undocumented extension point behavior',
    ],
    relationships: [
      { termId: 'plugin', relation: 'hosts' },
      { termId: 'surface-area', relation: 'part of' },
      { termId: 'contract', relation: 'defined by' },
    ],
    notThis: [
      'Not a hook—Extension Points are more formal and validated',
      'Not an event—Extension Points are for extension, not observation',
    ],
  },
  {
    id: 'capability',
    name: 'Capability',
    layer: 'plugin',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A declared feature or permission that a plugin provides or requires.',
    mentalModel: 'Capabilities are like badges. A plugin might wear a "can-send-email" badge (it provides email sending) and require a "has-network-access" badge from the environment. The system matches providers and consumers.',
    whyNeeded: 'Capabilities make dependencies explicit and discoverable. They enable the Registry to wire plugins together automatically and warn when required capabilities are missing.',
    guarantees: [
      'Capabilities are declared, not inferred',
      'Missing required capabilities prevent plugin activation',
      'Capabilities can be queried at runtime',
    ],
    antiPatterns: [
      'Overly broad capabilities (e.g., "can-do-anything")',
      'Capabilities that change meaning between versions',
      'Undeclared capabilities used implicitly',
    ],
    relationships: [
      { termId: 'plugin', relation: 'declared by' },
      { termId: 'registry', relation: 'matched in' },
      { termId: 'contract', relation: 'formalized as' },
    ],
    notThis: [
      'Not a permission in the security sense—Capabilities are functional, not access control',
      'Not optional—if declared as required, it must be satisfied',
    ],
  },
  {
    id: 'registry',
    name: 'Registry',
    layer: 'core',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A central catalog that tracks all registered plugins, adapters, and their capabilities.',
    mentalModel: 'The Registry is the phone book of the system. Need to find all plugins that provide authentication? Ask the Registry. Want to know what capabilities are available? The Registry knows.',
    whyNeeded: 'Decentralized registration leads to discovery problems. The Registry provides a single source of truth for what is loaded, what is available, and how components relate.',
    guarantees: [
      'The Registry is always up-to-date with loaded components',
      'Registration is idempotent—registering twice has no effect',
      'The Registry supports querying by capability, type, or metadata',
    ],
    antiPatterns: [
      'Bypassing the Registry with direct references',
      'Mutable registry entries after registration',
      'Using the Registry as a general-purpose data store',
    ],
    relationships: [
      { termId: 'plugin', relation: 'catalogs' },
      { termId: 'capability', relation: 'indexes' },
      { termId: 'core', relation: 'managed by' },
    ],
    notThis: [
      'Not a dependency injection container—Registry is for discovery, not construction',
      'Not a service locator—prefer explicit injection over lookup',
    ],
  },
  {
    id: 'theme',
    name: 'Theme',
    layer: 'ui',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A cohesive set of design tokens and styles that define visual appearance.',
    mentalModel: 'A Theme is a skin. The same UI components can wear different themes—light mode, dark mode, branded themes—without changing their structure or behavior.',
    whyNeeded: 'Theming separates presentation from structure. It enables white-labeling, accessibility modes, and user preferences without duplicating component code.',
    guarantees: [
      'Themes are applied consistently across all themed components',
      'Theme changes do not affect component logic',
      'Default theme is always available as fallback',
    ],
    antiPatterns: [
      'Hardcoded colors in components',
      'Theme logic mixed with business logic',
      'Themes that break accessibility',
    ],
    relationships: [
      { termId: 'design-token', relation: 'composed of' },
      { termId: 'ui-kit', relation: 'applied to' },
    ],
    notThis: [
      'Not a component library—Themes style components, they are not components themselves',
      'Not CSS-only—Themes include semantic tokens and constraints',
    ],
  },
  {
    id: 'design-token',
    name: 'Design Token',
    layer: 'ui',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A named, semantic value that represents a design decision.',
    mentalModel: 'Design Tokens are variables with meaning. Not "blue" but "primary-action-color." Not "16px" but "spacing-medium." They capture intent, not just value.',
    whyNeeded: 'Raw values scattered in code make global changes painful. Tokens centralize design decisions, enabling consistent updates and platform-specific translations.',
    guarantees: [
      'Tokens have consistent naming conventions',
      'Token values can be overridden per-theme',
      'Tokens are exported in multiple formats (CSS, JS, JSON)',
    ],
    antiPatterns: [
      'Tokens that encode implementation (e.g., "margin-16px")',
      'Too many tokens (decision paralysis)',
      'Tokens without semantic meaning',
    ],
    relationships: [
      { termId: 'theme', relation: 'part of' },
      { termId: 'ui-kit', relation: 'consumed by' },
    ],
    notThis: [
      'Not CSS variables alone—Tokens include semantics and constraints',
      'Not arbitrary—each token represents a deliberate design decision',
    ],
  },
  {
    id: 'ui-kit',
    name: 'UI Kit',
    layer: 'ui',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A library of reusable, themed UI components built on Logifex primitives.',
    mentalModel: 'The UI Kit is your component toolbox. Buttons, inputs, modals—all pre-built, tested, and themed. You assemble applications from these pieces rather than building from scratch.',
    whyNeeded: 'Consistency and speed. UI Kits ensure visual coherence across an application and reduce the time spent on common patterns.',
    guarantees: [
      'All UI Kit components respect the active Theme',
      'Components follow accessibility guidelines',
      'Components are tree-shakeable—unused code is not bundled',
    ],
    antiPatterns: [
      'Modifying UI Kit internals instead of using extension points',
      'Skipping UI Kit for "custom" components with duplicate logic',
      'Ignoring UI Kit accessibility features',
    ],
    relationships: [
      { termId: 'theme', relation: 'styled by' },
      { termId: 'design-token', relation: 'uses' },
    ],
    notThis: [
      'Not the only way to build UI—custom components are valid when needed',
      'Not framework-specific—UI Kit abstracts over rendering frameworks',
    ],
  },
  {
    id: 'devtools',
    name: 'DevTools',
    layer: 'tooling',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'Development-time utilities for debugging, inspecting, and profiling Logifex applications.',
    mentalModel: 'DevTools are X-ray glasses for your application. They let you see events flowing, state changing, and handlers executing—all in real time.',
    whyNeeded: 'Complex systems become opaque without tooling. DevTools reduce debugging time by surfacing internal behavior that would otherwise require console.log archaeology.',
    guarantees: [
      'DevTools are stripped from production builds',
      'DevTools do not affect runtime behavior when disabled',
      'DevTools respect Mode settings',
    ],
    antiPatterns: [
      'Depending on DevTools behavior in production',
      'DevTools that mutate application state',
      'Skipping DevTools when debugging',
    ],
    relationships: [
      { termId: 'mode', relation: 'enabled by' },
      { termId: 'inspector', relation: 'includes' },
      { termId: 'telemetry', relation: 'visualizes' },
    ],
    notThis: [
      'Not logging—DevTools are interactive, logs are passive',
      'Not monitoring—DevTools are for development, monitoring is for production',
    ],
  },
  {
    id: 'inspector',
    name: 'Inspector',
    layer: 'tooling',
    knowledge: 'advanced',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A DevTools component that provides real-time visibility into system internals.',
    mentalModel: 'The Inspector is a magnifying glass. Point it at any part of the system—an event stream, a component tree, a state slice—and see details invisible to the naked eye.',
    whyNeeded: 'Understanding "what is happening right now" is crucial for debugging. The Inspector provides live views into system behavior without adding log statements.',
    guarantees: [
      'Inspector updates in real-time',
      'Inspector does not modify inspected data',
      'Inspector can be focused on specific subsystems',
    ],
    antiPatterns: [
      'Using Inspector in production',
      'Inspector-driven development (fix the code, not the inspector view)',
      'Ignoring Inspector warnings',
    ],
    relationships: [
      { termId: 'devtools', relation: 'part of' },
      { termId: 'event-bus', relation: 'observes' },
      { termId: 'state-source', relation: 'visualizes' },
    ],
    notThis: [
      'Not a debugger—Inspector shows state, debuggers pause execution',
      'Not a profiler—Inspector shows what, profiler shows how fast',
    ],
  },
  {
    id: 'telemetry',
    name: 'Telemetry',
    layer: 'tooling',
    knowledge: 'advanced',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'The system for collecting, transmitting, and analyzing runtime metrics and traces.',
    mentalModel: 'Telemetry is the flight recorder. It captures what happened, when, and how long it took. After a crash (or a slow request), Telemetry provides the evidence for post-mortem analysis.',
    whyNeeded: 'You cannot improve what you cannot measure. Telemetry provides the data needed for performance optimization, error tracking, and usage analytics.',
    guarantees: [
      'Telemetry is opt-in and respects privacy settings',
      'Telemetry overhead is minimal in production',
      'Telemetry data is structured and queryable',
    ],
    antiPatterns: [
      'Telemetry without data retention policies',
      'Telemetry that captures PII without consent',
      'Telemetry as a replacement for proper logging',
    ],
    relationships: [
      { termId: 'devtools', relation: 'feeds into' },
      { termId: 'mode', relation: 'verbosity controlled by' },
    ],
    notThis: [
      'Not logging—Telemetry is structured and aggregatable',
      'Not analytics—Telemetry is technical, analytics is business-focused',
    ],
  },
  {
    id: 'state-source',
    name: 'State Source',
    layer: 'core',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'An abstraction representing any origin of state data.',
    mentalModel: 'State Sources are wells. They produce state—from local memory, remote APIs, databases, or browser storage. The system does not care where state comes from, only that it follows the State Source contract.',
    whyNeeded: 'Applications need state from many sources. State Source provides a unified interface, making it easy to swap implementations and test with mocks.',
    guarantees: [
      'State Sources provide consistent read/subscribe interfaces',
      'State Sources signal when data is loading, ready, or failed',
      'State Sources are composable',
    ],
    antiPatterns: [
      'Direct API calls bypassing State Sources',
      'State Sources with hidden side effects',
      'State Sources that don\'t handle errors',
    ],
    relationships: [
      { termId: 'state-adapter', relation: 'implemented by' },
      { termId: 'contract', relation: 'defined by' },
    ],
    notThis: [
      'Not a store—State Sources can be read-only',
      'Not a cache—State Sources may or may not cache',
    ],
  },
  {
    id: 'state-adapter',
    name: 'State Adapter',
    layer: 'plugin',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'An Adapter that connects a State Source to an external state management solution.',
    mentalModel: 'State Adapters are bridges. They connect Logifex\'s state abstraction to Redux, Zustand, MobX, or any other state library. Write your logic against State Source; choose your implementation via State Adapter.',
    whyNeeded: 'Teams have existing investments in state management solutions. State Adapters allow Logifex to integrate with these rather than forcing a rewrite.',
    guarantees: [
      'State Adapters implement the State Source contract',
      'State Adapters handle synchronization with external stores',
      'State Adapters are swappable without changing business logic',
    ],
    antiPatterns: [
      'Leaking external store APIs through the adapter',
      'State Adapters that don\'t maintain consistency',
      'Tight coupling to a specific State Adapter',
    ],
    relationships: [
      { termId: 'state-source', relation: 'implements' },
      { termId: 'adapter', relation: 'type of' },
    ],
    notThis: [
      'Not a state library—State Adapter wraps state libraries',
      'Not required—Logifex has default state management',
    ],
  },
  {
    id: 'validation-engine',
    name: 'Validation Engine',
    layer: 'core',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'The component responsible for validating data against Contracts at runtime.',
    mentalModel: 'The Validation Engine is a checkpoint. Data passes through, and the engine checks if it matches the expected Contract. Valid data proceeds; invalid data is rejected with clear errors.',
    whyNeeded: 'Contracts are only useful if enforced. The Validation Engine ensures that promises made by Contracts are kept, catching mismatches early.',
    guarantees: [
      'Validation is deterministic—same input, same result',
      'Validation errors are descriptive and actionable',
      'Validation can be disabled in production for performance (with warnings)',
    ],
    antiPatterns: [
      'Skipping validation for "trusted" data',
      'Validation that mutates data',
      'Validation with side effects',
    ],
    relationships: [
      { termId: 'contract', relation: 'enforces' },
      { termId: 'event', relation: 'validates' },
    ],
    notThis: [
      'Not business validation—Validation Engine checks structure, not business rules',
      'Not authorization—Validation is about shape, not permission',
    ],
  },
  {
    id: 'disabled-reason',
    name: 'Disabled Reason',
    layer: 'ui',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A structured explanation of why a UI element or feature is currently disabled.',
    mentalModel: 'Disabled Reason is the "why" behind a grayed-out button. Instead of leaving users guessing, it provides a clear explanation and, when possible, a path to enabling the feature.',
    whyNeeded: 'Disabled UI without explanation is frustrating. Disabled Reason improves UX by making the system\'s constraints visible and understandable.',
    guarantees: [
      'Disabled Reason is always user-facing text, not technical jargon',
      'Disabled Reason includes guidance when action is possible',
      'Disabled Reason is localized',
    ],
    antiPatterns: [
      'Hiding disabled elements instead of explaining them',
      'Technical error messages as Disabled Reason',
      'Disabled Reason without a path forward',
    ],
    relationships: [
      { termId: 'ui-kit', relation: 'used in' },
      { termId: 'capability', relation: 'may reference missing' },
    ],
    notThis: [
      'Not an error message—Disabled Reason explains state, not failure',
      'Not a tooltip—Disabled Reason is structured data, not just text',
    ],
  },
  {
    id: 'governance',
    name: 'Governance',
    layer: 'meta',
    knowledge: 'advanced',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'The policies and processes that govern the evolution of the Logifex ecosystem.',
    mentalModel: 'Governance is the constitution. It defines how decisions are made, how changes are approved, and how the ecosystem maintains coherence as it grows.',
    whyNeeded: 'Without governance, ecosystems fragment. Governance ensures that plugins remain compatible, that breaking changes are communicated, and that the community has a voice.',
    guarantees: [
      'Governance decisions are documented and public',
      'Major changes require RFC (Request for Comments) process',
      'Governance includes a clear escalation path',
    ],
    antiPatterns: [
      'Governance by fiat without community input',
      'Governance that changes too frequently',
      'Governance without enforcement',
    ],
    relationships: [
      { termId: 'compatibility-matrix', relation: 'references' },
      { termId: 'deprecation-policy', relation: 'includes' },
      { termId: 'certification', relation: 'enables' },
    ],
    notThis: [
      'Not bureaucracy—Governance enables, not blocks',
      'Not optional—even minimal governance is governance',
    ],
  },
  {
    id: 'compatibility-matrix',
    name: 'Compatibility Matrix',
    layer: 'meta',
    knowledge: 'advanced',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A versioned table that documents which plugins and adapters work with which Core versions.',
    mentalModel: 'The Compatibility Matrix is the guest list. Before bringing a plugin to the party, check the matrix to see if it\'s compatible with your version of Core.',
    whyNeeded: 'Plugin ecosystems face version compatibility challenges. The Compatibility Matrix makes these explicit, reducing "works on my machine" scenarios.',
    guarantees: [
      'The matrix is updated with each release',
      'The matrix is machine-readable',
      'The matrix includes known incompatibilities',
    ],
    antiPatterns: [
      'Ignoring the matrix and hoping for the best',
      'Matrix without automated verification',
      'Outdated matrix entries',
    ],
    relationships: [
      { termId: 'governance', relation: 'maintained by' },
      { termId: 'plugin', relation: 'documents compatibility of' },
    ],
    notThis: [
      'Not a dependency lock file—Matrix is documentation, not enforcement',
      'Not optional—every release must update the matrix',
    ],
  },
  {
    id: 'deprecation-policy',
    name: 'Deprecation Policy',
    layer: 'meta',
    knowledge: 'advanced',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'The rules governing how features are marked as deprecated and eventually removed.',
    mentalModel: 'Deprecation Policy is the retirement plan. Features don\'t disappear overnight. They are marked deprecated, given a sunset period, and only then removed.',
    whyNeeded: 'Sudden removals break ecosystems. Deprecation Policy gives developers time to migrate, maintains trust, and keeps the upgrade path smooth.',
    guarantees: [
      'Deprecations are announced at least N versions in advance',
      'Deprecated features continue to work until removal',
      'Migration paths are documented',
    ],
    antiPatterns: [
      'Deprecating without alternatives',
      'Removing features without deprecation period',
      'Ignoring deprecation warnings',
    ],
    relationships: [
      { termId: 'governance', relation: 'part of' },
      { termId: 'compatibility-matrix', relation: 'reflected in' },
    ],
    notThis: [
      'Not removal—deprecation is a warning, not an action',
      'Not optional—all removals must go through deprecation',
    ],
  },
  {
    id: 'certification',
    name: 'Certification',
    layer: 'meta',
    knowledge: 'advanced',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A formal verification that a plugin or adapter meets defined quality and compatibility standards.',
    mentalModel: 'Certification is a seal of approval. Certified plugins have been tested, reviewed, and verified to work correctly with specific versions of Core.',
    whyNeeded: 'In large ecosystems, quality varies. Certification provides trust signals, helping users choose reliable plugins and encouraging developers to meet high standards.',
    guarantees: [
      'Certification criteria are public and measurable',
      'Certification is version-specific',
      'Certification can be revoked if standards are no longer met',
    ],
    antiPatterns: [
      'Certification without ongoing verification',
      'Certification as gatekeeping rather than quality signal',
      'Self-certification without external review',
    ],
    relationships: [
      { termId: 'governance', relation: 'enabled by' },
      { termId: 'plugin', relation: 'applies to' },
      { termId: 'compatibility-matrix', relation: 'verified against' },
    ],
    notThis: [
      'Not required—uncertified plugins can still be used',
      'Not permanent—certification has expiry or version bounds',
    ],
  },
  {
    id: 'preset',
    name: 'Preset',
    layer: 'plugin',
    knowledge: 'optional',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A pre-configured bundle of plugins, settings, and opinions for a specific use case.',
    mentalModel: 'A Preset is a starter kit. Instead of choosing and configuring each plugin individually, you pick a Preset that bundles sensible defaults for your use case.',
    whyNeeded: 'Configuration fatigue is real. Presets reduce time-to-productivity by encapsulating best practices and common patterns.',
    guarantees: [
      'Presets are versioned and documented',
      'Presets can be extended or overridden',
      'Presets declare their included plugins explicitly',
    ],
    antiPatterns: [
      'Presets that hide important configuration',
      'Presets without escape hatches',
      'Monolithic presets that include unnecessary plugins',
    ],
    relationships: [
      { termId: 'plugin', relation: 'bundles' },
      { termId: 'opinion-boundary', relation: 'represents' },
      { termId: 'escape-hatch', relation: 'should provide' },
    ],
    notThis: [
      'Not locked—Presets are starting points, not prisons',
      'Not required—advanced users can configure manually',
    ],
  },
  {
    id: 'opinion-boundary',
    name: 'Opinion Boundary',
    layer: 'meta',
    knowledge: 'advanced',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'The explicit line between decisions made by the framework and decisions left to the user.',
    mentalModel: 'Opinion Boundary is the fence. On one side, Logifex makes decisions (event format, lifecycle phases). On the other side, you decide (state management library, UI framework).',
    whyNeeded: 'Frameworks that decide everything are inflexible. Frameworks that decide nothing are useless. Opinion Boundary makes the tradeoff explicit.',
    guarantees: [
      'Opinion Boundaries are documented',
      'Crossing a boundary is possible but requires explicit action',
      'Boundaries are stable within major versions',
    ],
    antiPatterns: [
      'Unclear boundaries leading to accidental lock-in',
      'Boundaries that shift without notice',
      'Boundaries without escape hatches',
    ],
    relationships: [
      { termId: 'preset', relation: 'encoded in' },
      { termId: 'escape-hatch', relation: 'crossed via' },
      { termId: 'governance', relation: 'defined by' },
    ],
    notThis: [
      'Not arbitrary—boundaries reflect intentional design',
      'Not walls—boundaries can be crossed when needed',
    ],
  },
  {
    id: 'escape-hatch',
    name: 'Escape Hatch',
    layer: 'meta',
    knowledge: 'advanced',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'A documented mechanism for bypassing framework opinions when necessary.',
    mentalModel: 'An Escape Hatch is an emergency exit. When the framework\'s opinion doesn\'t fit your need, the escape hatch lets you override it—with full awareness of the consequences.',
    whyNeeded: 'No framework anticipates every use case. Escape Hatches prevent developers from hacking around limitations and provide sanctioned paths for advanced customization.',
    guarantees: [
      'Escape Hatches are documented with risks and alternatives',
      'Using an Escape Hatch does not break core functionality',
      'Escape Hatches are versioned with stability guarantees',
    ],
    antiPatterns: [
      'Escape Hatches that void all warranties',
      'Using Escape Hatches for common use cases (signals a missing feature)',
      'Undocumented escape hatches',
    ],
    relationships: [
      { termId: 'opinion-boundary', relation: 'crosses' },
      { termId: 'preset', relation: 'overrides' },
    ],
    notThis: [
      'Not encouraged—Escape Hatches are for edge cases',
      'Not unsupported—Escape Hatches are official, just advanced',
    ],
  },
  {
    id: 'surface-area',
    name: 'Surface Area',
    layer: 'meta',
    knowledge: 'advanced',
    status: 'stable',
    version: 'v1.0',
    oneLine: 'The total set of public APIs, extension points, and contracts exposed by a component.',
    mentalModel: 'Surface Area is the interface perimeter. A larger surface area means more ways to interact—but also more to maintain and more potential for breaking changes.',
    whyNeeded: 'Understanding surface area helps make design decisions. Minimizing unnecessary surface area reduces maintenance burden and increases stability.',
    guarantees: [
      'Surface Area is documented for each component',
      'Expanding Surface Area is deliberate',
      'Reducing Surface Area requires deprecation policy',
    ],
    antiPatterns: [
      'Accidentally exposing internals as Surface Area',
      'Surface Area without versioning',
      'Ignoring Surface Area in code reviews',
    ],
    relationships: [
      { termId: 'extension-point', relation: 'includes' },
      { termId: 'contract', relation: 'includes' },
      { termId: 'deprecation-policy', relation: 'governed by' },
    ],
    notThis: [
      'Not just APIs—Surface Area includes all interaction points',
      'Not bad—Surface Area is necessary, just intentional',
    ],
  },
];

export function getTermById(id: string): Term | undefined {
  return terminology.find(t => t.id === id);
}

export function getTermsByLayer(layer: Layer): Term[] {
  return terminology.filter(t => t.layer === layer);
}

export function getTermsByKnowledge(knowledge: Knowledge): Term[] {
  return terminology.filter(t => t.knowledge === knowledge);
}

export function getRelatedTerms(termId: string): Term[] {
  const term = getTermById(termId);
  if (!term) return [];
  return term.relationships
    .map(r => getTermById(r.termId))
    .filter((t): t is Term => t !== undefined);
}
