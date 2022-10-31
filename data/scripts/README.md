## data-generator
A Blender Python script that automatically imports each character asset in `.fbx` format into Blender, and render the character at 3 camera positions (front, side, back), with pre-defined lighting and output resolution. Only ambient light is used.


## mixamo-downloader
A simple js for mass-downloading resources from [Mixamo](https://www.mixamo.com/#/). It is based on [this repo](https://github.com/gnuton/mixamo_anims_downloader) that mass-downloads all the animations of one chosen character from Mixamo. With customisable parameters, the script supports downloading of multiple animations of multiple characters. The script also handles exceptions when downloading multiple large assets concurrently.