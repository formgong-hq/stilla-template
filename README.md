# Stilla: a calm activewear store with Formgong forms

**Live demo:** https://stilla.formgong.com · Download: the [latest release](https://github.com/formgong-hq/stilla-template/releases/latest) zip.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/formgong-hq/stilla-template) [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fformgong-hq%2Fstilla-template&project-name=stilla&repository-name=stilla)

Each button copies the site to your GitHub and publishes it. Then replace every `fk_your_access_key` in the `.html` files of your copy with your Formgong access key (free at https://formgong.com/new) and commit: the host republishes on its own.

Сайт магазину спортивного одягу з формами Формгонг

A static storefront template in a minimal Scandinavian style: a home page, an "All products" catalogue with filter and sort, and a page for each product. No build step, no dependencies: plain HTML, one CSS file and one small script. The brand Stilla, its products, prices and copy are fictional.

- **Header.** A Studio / Shop switch above a white header: wordmark, centred menu, search, wishlist, bag and account icons. On phones the menu folds into a burger.
- **Home** (`index.html`). Full-width photo hero, a centred intro with category links, split photo/text sections, a "Most loved" product row, a customer quote, an FAQ accordion and a newsletter block with a large photo.
- **Catalogue** (`collections/all/`). A split banner (photo, breadcrumb, title, category tabs), a toolbar with the product count, a large/small grid switch and **Filter & sort**. The grid mixes product cards with large lifestyle tiles. The filter drawer filters by category, colour and size and sorts by price or name, without reloading; `#tops`, `#tights` and `#accessories` in the URL open that category.
- **Motion.** Text fades up, cards appear in a short wave and large photos settle as you scroll. With reduced motion, or without JavaScript, everything is simply shown.
- **Product cards.** A second photo on hover, a wishlist heart (saved in the browser), a badge, colour swatches and Quick add.
- **Product pages** (`products/<slug>/`). A photo gallery (a swipe row on phones), colour and size pickers, Add to bag with a size check, delivery perks, accordions and a **size question form**, then related products.
- **Footer.** A newsletter field, three link columns and the "Forms powered by Formgong" credit.

## Forms

There are three Formgong forms: the newsletter block on the home page, the newsletter field in every footer, and the size question form on each product page.

1. Create a form in the Formgong dashboard and copy its access key.
2. Replace every `fk_your_access_key` with that key (find and replace across all files).
3. Each form sends a hidden `request` field (`Newsletter` or `Size question`); the size form also sends `product`, so you can tell messages apart in one inbox.

A form shows its thank-you text only when Formgong answers `success: true`; otherwise it shows the error and keeps what was typed. The bag and wishlist are demo UI only: connect your own shop or checkout for real orders.

## Edit

- Colours and fonts are at the top of `assets/style.css` (`--ink`, `--muted`, `--mist`, `--head`, `--body`). Fonts are Inter and Cabin from Google Fonts.
- Products: copy an `<article class="card">` in `collections/all/index.html` and set `data-cat`, `data-color`, `data-size` and `data-price`; filters read these attributes. Copy a folder in `products/` for a new product page.

## Images

All 18 photos were generated for this template with AI image generation (FLUX.2 [pro], Black Forest Labs) and saved as WebP in three widths (480, 960, 1600 px), about 1.4 MB in all and about 0.55 MB at 960 px. No stock photos are used. The people shown are not real. You may use the images in your own site; replace them with your own product photos, keeping the file names.

## Українська

Статичний шаблон магазину спортивного одягу в мінімалістичному скандинавському стилі: головна, каталог «All products» з фільтрами й сортуванням і сторінка кожного товару. Без збірки й залежностей. Бренд Stilla, товари й ціни вигадані.

**Форми.** Їх три: підписка на головній, підписка у футері й питання про розмір на сторінці товару. Замініть усі `fk_your_access_key` на ключ своєї форми Formgong. Подяка з'являється лише тоді, коли Formgong відповідає `success: true`. Кошик і список бажань тут лише для демонстрації.

**Зображення.** Усі 18 фото згенеровано для цього шаблону нейромережею FLUX.2 [pro] (Black Forest Labs) і збережено у WebP. Стокових фото немає, людей на фото не існує.

MIT license.
