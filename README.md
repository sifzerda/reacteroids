# Asteroids 3.0

## Table of Contents

- [Description](#description)
- [Badges](#badges)
- [Visuals](#visuals)
- [Installation](#installation)
- [Tech](#tech)
- [Support](#support)
- [Contributing](#contributing)
- [Authors and Acknowledgment](#authors-and-acknowledgment)
- [License](#license)
- [Project Status](#project-status)

## Description

This is second rebuild of my first two asteroids games. The first was a fullstack app built in React + Express, with a MongoDB + graphQl and Matter.js game engine. The second was a serverless Next.js version + Prisma Postgres DB and Three.js game engine + Zustand. Version III was built with React, Three.js game engine, Miniplex ECS architecture.

## Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![Create React App](https://img.shields.io/badge/Create%20React%20App-09D3AC.svg?style=for-the-badge&logo=Create-React-App&logoColor=white) ![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Three.js](https://img.shields.io/badge/Three.js-000000.svg?style=for-the-badge&logo=threedotjs&logoColor=white) 

~~![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)~~  
~~![JSON Web Tokens](https://img.shields.io/badge/JSON%20Web%20Tokens-000000.svg?style=for-the-badge&logo=JSON-Web-Tokens&logoColor=white)~~ 
## Visuals

This app has been deployed to Vercel. Visit the site: [React Asteroids](https://.../)

![pic1](...)
![pic2](...)
![pic4](...)

## Installation

Play through app site, no installation required. Otherwise clone into local machine and open on IDE:

```bash
# clone the repo
git clone https://github.com/sifzerda/reacteroids.git

# move into directory
cd reacteroids

# install dependencies
npm install

# run server
npm run start
```

## Tech

- React
- TailwindCSS
- react-router-dom
- Three.js + post-processing
- Miniplex
- ECS architecture: Entities, Components, Systems, & factories, renderers
- useMemo

## Support

For support, users can contact me through my portfolio contact form: [here](https://next-portfolio-sifzerdas-projects.vercel.app/contact)

## Contributing

Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". 
1.	Fork the Project
2.	Create your Feature Branch (git checkout -b feature/NewFeature)
3.	Commit your Changes (git commit -m 'Add some NewFeature')
4.	Push to the Branch (git push origin feature/NewFeature)
5.	Open a Pull Request

## Authors and acknowledgment

The author acknowledges and credits those who have contributed to this project.

## License

Distributed under the MIT License. See LICENSE.txt for more information.

## Project status

This project is incomplete and requires further development. Currently the highscores page, if any, is just for display, further development is needed to allow users to submit their scores.

## ECS structure

Layer	            Responsibility
...................................
Components	        Data only
Systems	            Behavior
Factories       	Create entities
Renderers	        Visuals only
Weapons	Modular     firing logic

## Tasks

- [x] add different weapons with an easy system to add more
- [x] levels/difficulty
- [x] score system
- [x] start screen, end screen, game over screen
- [x] pause screen
- [x] how to play screen
- [ ] submit highscores
- [ ] sfx
- [ ] optimization
- [ ] effect enhancement

- [x] ECS system architecture which is data-flow driven rather than creates objects and classes

Extras once full base game working:
- [ ] more guns types
- [ ] powerups, ship health etc
- [ ] add damage bar which when it goes down, ship loses a life
- [ ] add health packs which restore health
- [x] enhance bullet vfx
- [x] enhance exhaust particle vfx
- [ ] enhance ship and rock vfx/appearance
- [ ] sfx
- [x] fix up start screen UI
- [x] asteroid destroyed bar not aligned with play

- [ ] trial a shader based GPU exhaustparticle renderer for better performance

- [ ] reposition bullets correctly

- [ ] fix in game HUD stats





GRAPHICS TIPS:

CPU ECS + instancing        =	medium particles, game objects
InstancedMesh               =	up to ~10k–20k simple objects
Shader points	            =	up to ~10k–200k particles
Framebuffer Object (FBO)    =	up to ~10k–1M particles fluid systems


top-tier setup is:

3-stage GPU pipeline
1. Simulation (GPU) 
> position texture 
> velocity texture 
> life decay
2. Rendering (GPU)
> point sprite shader
> or instanced billboard shader
3. Post FX
> bloom
> motion blur
> tone mapping
