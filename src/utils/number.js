class NumberUtils {

  prefixInteger(number, length) {
    return (Array(length).join('0') + number).slice(-length);
  }

}

export default new NumberUtils();
