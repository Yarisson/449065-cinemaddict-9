export const createFooterTemplate = ({numberAllFilms}) => {
  return `<section
   class="footer__logo logo logo--smaller">Cinemaddict</section>
  <section class="footer__statistics">
    <p>${numberAllFilms} movies inside</p>
  </section>`;
};
