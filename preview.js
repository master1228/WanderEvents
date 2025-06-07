import { getLinkPreview } from 'link-preview-js';

(async () => {
  try {
    const data = await getLinkPreview('https://wanderevents.pl');
    console.log(data);
  } catch (e) {
    console.error('Error fetching preview:', e);
  }
})();
