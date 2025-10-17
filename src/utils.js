export function flipCoin() {
    const randomNumber = Math.random();
    return randomNumber < 0.5;
}

export function getDimensions() {
    const maxWidth = 480;
    const maxHeight = 720;

    if (isMobileDevice()) {
        return {
            height: window.innerWidth,
            width: window.innerHeight
        }
    } else {
        return {
            height: 720,
            width: 480
        }
    }
}


export function isMobileDevice() {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(navigator.userAgent);
}