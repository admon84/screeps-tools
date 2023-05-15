# Screeps Tools

Tools to help players of the Programming MMO Screeps.

> ### New Screepers Edition in 2023!
> Be sure to check out the Screepers Edition of this project which has even more features: [screepers/screeps-tools](https://github.com/screepers/screeps-tools)

### Building Planner

Plan your base layouts for Screeps with the Building Planner tool.

Set the RCL and place structures on the map to create a base layout plan.

Features:
* Structure placement following in-game logic (ramparts over structures, containers on roads)
* Terrain and existing structures can be imported from live MMO and seasonal rooms
* Roads are visually connected together using SVGs

Controls:

- Left-click to place structure at position
- Right-click to erase structure at position
- Hold left-click and drag to place multiple structures while dragging
- Hold right-click and drag to erase while dragging

![building planner](https://user-images.githubusercontent.com/10291543/95763564-6a0a6700-0c6c-11eb-9eb8-7325b98a4437.png)

### Creep Designer

Configure Creeps body parts and evaluate stats with the Creep Designer tool.

_This is similar to [o4kapuk's creep calculator](https://codepen.io/o4kapuk/full/ZKeorE)_

Features:
* Generates a stats table based on creep body parts you add
* Estimates creep abilities and effectiveness over time
* Lists out the available creep actions
* Includes support for boosted parts

![creep designer](https://user-images.githubusercontent.com/10291543/95763598-78f11980-0c6c-11eb-9303-362c962876e4.png)

## Getting started

Screeps Tools is easy to install and run on your local machine.

### Requirements

* Node.js 14+

### Install and run

* Clone or download this repo
* Install dependencies with `npm install`
* Start the app with `npm start`

## History

I initiated this project in July 2019 as a fork from [Aracath/screeps-tools](https://github.com/Arcath/screeps-tools), aiming to enhance the UI and incorporate additional features. Subsequently, in 2021, I transitioned from the [screeps-tools-fork](https://github.com/admon84/screeps-tools-fork) repository and established this repository with a Python backend for API calls. For several years, I hosted this rendition of Screeps Tools on screeps.admon.dev. However, in 2023, I ceased hosting Screeps Tools on screeps.admon.dev and executed a final update to this project, replacing the Python backend with simple fetch API calls in the React client.

## Credits

- [Aracath/screeps-tools](https://github.com/Arcath/screeps-tools)
