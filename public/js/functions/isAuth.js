/*****************************************************************/
/*                     USER AUTHENTICATION CHECK                 */
/*****************************************************************/

export function isUserLoggedIn() {
  return localStorage.getItem("authToken") !== null;
}
