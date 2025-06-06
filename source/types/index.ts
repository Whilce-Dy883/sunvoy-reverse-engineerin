/**
 * Represents a user object returned from the API or scraped from HTML.
 */
export interface User {
  /** Unique identifier for the user */
  id: string;

  /** User's first name */
  firstName: string;

  /** User's last name */
  lastName: string;

  /** User's email address */
  email: string;

  /** Additional dynamic properties */
  [key: string]: any;
}

/**
 * Represents the structure of the authentication data stored in .auth.json.
 */
export interface AuthData {
  /** Session cookie string used for authenticated requests */
  cookie: string;
}