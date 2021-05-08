# Websocket Remote

![Foundry v0.7.9](https://img.shields.io/badge/Foundry-v0.7.9-informational)
![Latest Release Download Count](https://img.shields.io/github/downloads/freudiangoat/material-remote/latest/module.zip)

<!--- Forge Bazaar Install % Badge -->
<!--- replace <your-module-name> with the `name` in your manifest -->
<!--- ![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2F<your-module-name>&colorB=4aa94a) -->

## Changelog

### 0.2.3

* Hotfix to address parsing issues for URLs with no protocol.

### 0.2.2

* Combat functionality
  * Added move to next/previous turn support
  * Added start with all players support
* Improved remote connection management
  * Added better reconnection handling
  * Fixed 'ws://' urls being handled incorrectly.

### 0.2.1

* Added support for playing and stopping playlists.

### 0.2.0

* Added support for multiple states with independent mappings.
* Fixed undefined references when receiving unmapped messages.
* Updated the spec for analog messages.
* Added support for changing the darkness of scenes using analog controls.
* Buttons can be used to switch between states.

### 0.1.4

* Added support for beginning and ending combat encounters.
* Minor bug fixes.

### 0.1.3

* First release
* Added support for two message types: 'button' and 'analog'
* Macros can be bound to incoming messages
* Remote server is informed of all buttons that are bound to actions.

## Description

Material Remote is a Foundry VTT module that provides a flexible way to have an external service control your games in Foundry VTT.

Currently, the module supports performing the following actions within foundry:

* [x] Executing macros
* [x] Changing scene lighting
* [x] Starting/Finishing combat
* [ ] Controlling Playlists

## License

MIT Licensed
