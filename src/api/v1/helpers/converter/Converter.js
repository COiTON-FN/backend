exports.byteArrayToString = (data) => {
  try {
    // Ensure the input is a string and parse it into an array of numbers
    const byteArray = Array.isArray(data)
      ? data
      : data?.split(",").map((num) => parseInt(num, 10));

    // Convert byte array to string
    const jsonString = String.fromCharCode(...byteArray);
    return jsonString === "" ? {} : JSON.parse(jsonString);
  } catch (error) {
    console.error("Error converting byte array to string:", error);
    return null;
  }
};

exports.stringToByteArray = (str) => {
  let utf8 = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) {
      utf8.push(charcode);
    } else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    } else {
      i++;
      charcode =
        0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
  }
  return utf8;
};
