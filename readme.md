# platform-sdk

## Installation Requirements (TODO)

1. `npm i -g typescript`

## Proposed Changes - 0.4.0

1. Removal of `tough-cookie`. **Reason**: let platforms handle cookies on their own.
2. Require a single `Platform` interface object from platforms. **Reason**: it's cleaner & more in line with NPM to require a single file export.
3. Semantic changes to the interface function names to mention the object type first & then the function type -- for eg. `threadGet`, `messageGet`, `userGet`, `messageSend` etc. **Reason**: it's cleaner & more uniform
4. Removal of `mapMessages` & `mapThreads`. **Reason**: let Texts handle message & threads arrays -- as this can be made more performant in the future.
5. Let platforms export their own native types. **Reason**: Since it's a simple mapping function -- a Texts wrapper layer should handle the conversions to make the API cleaner & more developer friendly
6. Added `userGet`, `threadGet` & `messageGet`. **Reason**: So that Texts can easily fetch a single user, thread or message when required.
7. Replaced event callbacks with a single `EventEmitter`. **Reason**: Cleaner, more standard method for handling events.
8. Removed all `login` & `init` functions & replaced with a single `login` function: **Reason**: It gives a single standard way to initialize the platform
