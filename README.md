# harponica
HarpJS had issues that prevented it from being bundled with an Electron app. Namely, this was its node-sass dependency, which prevented it from being effectively used cross-platform. As a result, Harponica was created to serve the sole purpose of creating a small server capable of rendering and compiling .pug files. 

This project will eventually grow to support other file formats and features, but for now it is strictly barebones, lightweight, and meant for use solely as an embedded feature of UniversityHigh's editor (https://github.com/UniversityHigh/editor).
