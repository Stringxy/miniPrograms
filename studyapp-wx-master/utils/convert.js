function convert(str){
  console.log(str)
    str = str.replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "‹")
        .replace(/&gt;/g, "›")
        .replace("<", "‹")
        .replace(">", "›")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&copy;/g, "©")
        .replace(/&reg;/g, "®")
        .replace(/&times;/g, "×")
        .replace(/&divide;/g, "÷")
        .replace(/&#39;/g, "'")
        .replace(/\n/g, "<br>");
        return str;
}

module.exports = convert;