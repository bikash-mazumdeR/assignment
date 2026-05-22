export const SELECTORS = {
  LOGIN: {
    USERNAME: '[data-test="username"]',
    PASSWORD: '[data-test="password"]',
    LOGIN_BUTTON: '[data-test="login-button"]',
    ERROR_MESSAGE: '[data-test="error"]',
  },
  INVENTORY: {
    CONTAINER: '.inventory_list',
    CART_BADGE: '.shopping_cart_badge',
    SORT_CONTAINER: '[data-test="product-sort-container"]',
    CART_LINK: '.shopping_cart_link',
    ITEM: '.inventory_list .inventory_item',
    ITEM_NAME: '.inventory_item_name',
    ITEM_PRICE: '.inventory_item_price',
    ADD_TO_CART_BUTTON: 'button:has-text("Add to cart")',
    REMOVE_BUTTON: 'button:has-text("Remove")',
  },
  CART: {
    ITEM: '.cart_item',
    CHECKOUT_BUTTON: '[data-test="checkout"]',
    REMOVE_BUTTON: 'button:has-text("Remove")',
  },
  CHECKOUT: {
    FIRST_NAME: '[data-test="firstName"]',
    LAST_NAME: '[data-test="lastName"]',
    POSTAL_CODE: '[data-test="postalCode"]',
    CONTINUE_BUTTON: '[data-test="continue"]',
    FINISH_BUTTON: '[data-test="finish"]',
    COMPLETE_HEADER: '.complete-header',
    ERROR_MESSAGE: '[data-test="error"]',
  },
};
