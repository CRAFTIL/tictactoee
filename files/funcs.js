
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }
      
      function setLang(newLang) {
        setCookie("lang", newLang, 999)
      }
    
      function getLang() {
        return getCookie("lang")
      }
    
      function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
    
    
      function deleteCookie(name) {   
        document.cookie = name + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      }

      
function element(query = "") {
  if (query.startsWith("#")) {
    return document.getElementById(query.split("#")[1]);
  }
  if (query.startsWith(".")) {
    return document.getElementsByClassName(query.split(".")[1]);
  } else {
    return document.getElementsByTagName(query);
  }
}

function translate(number = 1) {
  number = number.toString();
  switch (number) {
    case "0":
      return "zero";
      break;
    case "1":
      return "one";
      break;
    case "2":
      return "two";
      break;
    case "3":
      return "three";
      break;
    case "4":
      return "four";
      break;
    case "5":
      return "five";
      break;
    case "6":
      return "six";
      break;
    case "7":
      return "seven";
      break;
    case "8":
      return "eight";
      break;
  }
}

function reverseTranslate(number = "") {
  number = number.toString();
  switch (number) {
    case "zero":
      return "0";
      break;
    case "one":
      return "1";
      break;
    case "two":
      return "2";
      break;
    case "three":
      return "3";
      break;
    case "four":
      return "4";
      break;
    case "five":
      return "5";
      break;
    case "six":
      return "6";
      break;
    case "seven":
      return "7";
      break;
    case "eight":
      return "8";
      break;
  }
}


    


