import {getUser} from '../data.js';

export const createProfileRatingTemplate = ({status}) => {
  return ` <section
   class="header__profile profile">
  <p class="profile__rating">${status}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
