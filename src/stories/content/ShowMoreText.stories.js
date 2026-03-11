/**
 * Truncates long text content with a "View more" link that reveals the full text.
 * Used throughout BOPS to keep pages scannable while making full details available.
 */
export default {
  title: "Content/Show More Text",
};

const longText = `The proposed development involves the construction of a two-storey rear extension measuring approximately 4 metres in depth and 6 metres in width. The extension will provide an enlarged kitchen and dining area on the ground floor, with an additional bedroom and en-suite bathroom on the first floor. Materials will match the existing dwelling, including London stock brick and slate roof tiles. The development is considered to be in keeping with the character of the surrounding area and compliant with the local development plan policies regarding residential extensions.`;

const shortText = `Single-storey rear extension to provide enlarged kitchen.`;

export const Truncated = {
  render: () => `
    <div>
      <div class="govuk-!-padding-bottom-1">
        <div class="truncated-content govuk-!-padding-bottom-2">
          <p class="govuk-body govuk-!-margin-bottom-1">${longText.substring(0, 300)}...</p>
        </div>
        <a href="#" class="govuk-link show-more" onclick="
          this.previousElementSibling.style.display = 'none';
          this.nextElementSibling.style.display = 'block';
          this.style.display = 'none';
          return false;
        ">View more</a>
        <div style="display: none;">
          <p class="govuk-body govuk-!-margin-bottom-1">${longText}</p>
        </div>
      </div>
    </div>
  `,
};

export const ShortContent = {
  render: () => `
    <div>
      <div class="govuk-!-padding-bottom-2">
        <p class="govuk-body govuk-!-margin-bottom-1">${shortText}</p>
      </div>
    </div>
  `,
};
