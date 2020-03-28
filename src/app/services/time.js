function getFormatedTime(time) {
    time = Math.round(time);
    const second = time % 60;
    const minutes = Math.floor(time / 60);
    const hour = Math.floor(time / 3600);

    let result = '';

    result += hour > 0 ? hour + 'hr' : ' ';
    result += minutes > 0 ? minutes + 'mins' : ' ';
    result += second > 0 ? second + 's' : '';
    return result;
}

export { getFormatedTime };