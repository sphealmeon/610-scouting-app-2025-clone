/**
 * @returns the cookie's value or an empty string if cookie does not exist
 * @param cookie the cookie to be returned
 */
export function getCookie(cookie: string) {
    if (typeof document !== "undefined") {
      const addedCookie = cookie + "=";
      if (document.cookie.indexOf(addedCookie) == -1) {
        return "";
      }
      const startingIndex: number =
        document.cookie.indexOf(addedCookie) + addedCookie.length;
      let endingIndex: number = document.cookie.indexOf(";", startingIndex);
      if (endingIndex == -1) {
        endingIndex = document.cookie.length;
      }
      return document.cookie.substring(startingIndex, endingIndex);
    }
    return "";
  }
  /**
   * creates or modifies cookie
   * @param name name of the cookie
   * @param value value of the cookie
   * @param expires days ahead to expire, if undefined, one year
   */
  export function setCookie(name: string, value: string, expires?: number) {
    if (typeof document !== "undefined") {
      const now = new Date();
      const time = now.getTime();
      const expireTime = time + 1000 * 60 * 60 * 24 * (expires ? expires : 365);
      now.setTime(expireTime);
      document.cookie = name + "=" + value + ";expires=" + now.toUTCString();
    }
  }
  
  /**
   * delete specified cookie
   * @param name name of cookie to delete
   */
  export function deleteCookie(name: string) {
    if (typeof document !== "undefined") {
      const now = new Date();
      const time = now.getTime();
      const expireTime = time - 1000 * 60 * 60 * 24 * 1;
      now.setTime(expireTime);
      document.cookie = name + "=" + ";expires=" + now.toUTCString();
    }
  }