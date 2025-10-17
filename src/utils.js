export function flipCoin() {
    const randomNumber = Math.random();
    return randomNumber < 0.5;
}

export function getDimensions(scene) {
    let { width, height } = scene.scale;

    if (width > height) {
        width = 480;
        height = 720;
    }
    return { width, height };
}


export function isMobileDevice() {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(navigator.userAgent);
}