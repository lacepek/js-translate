const RELEASE_MODE = !!(process.env.RELEASE)

if (!RELEASE_MODE) {
    console.log('Run `npm run release` to publish the package')
    process.exit(1) //which terminates the publish process
}