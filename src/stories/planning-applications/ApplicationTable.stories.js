/**
 * Tables used to list planning applications with key details.
 * Based on GOV.UK table component with BOPS status tags.
 */
export default {
  title: "Planning Applications/Application Table",
};

export const Default = {
  render: () => `
    <table class="govuk-table">
      <caption class="govuk-table__caption govuk-table__caption--m">Planning applications</caption>
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Reference</th>
          <th scope="col" class="govuk-table__header">Address</th>
          <th scope="col" class="govuk-table__header">Type</th>
          <th scope="col" class="govuk-table__header">Status</th>
          <th scope="col" class="govuk-table__header">Case officer</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr class="govuk-table__row">
          <td class="govuk-table__cell"><a class="govuk-link" href="#">BPS-24-00123</a></td>
          <td class="govuk-table__cell">12 High Street, SE1 1AA</td>
          <td class="govuk-table__cell">Householder</td>
          <td class="govuk-table__cell">
            <strong class="govuk-tag govuk-tag--light-blue govuk-tag--status-in_progress">In progress</strong>
          </td>
          <td class="govuk-table__cell">Sarah Johnson</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell"><a class="govuk-link" href="#">BPS-24-00124</a></td>
          <td class="govuk-table__cell">45 Park Road, E2 3BB</td>
          <td class="govuk-table__cell">Full planning</td>
          <td class="govuk-table__cell">
            <strong class="govuk-tag govuk-tag--blue govuk-tag--status-not_started">Not started</strong>
          </td>
          <td class="govuk-table__cell">Mark Thompson</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell"><a class="govuk-link" href="#">BPS-24-00125</a></td>
          <td class="govuk-table__cell">8 Church Lane, N1 4CC</td>
          <td class="govuk-table__cell">Prior approval</td>
          <td class="govuk-table__cell">
            <strong class="govuk-tag govuk-tag--green govuk-tag--status-approved">Approved</strong>
          </td>
          <td class="govuk-table__cell">Sarah Johnson</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell"><a class="govuk-link" href="#">BPS-24-00126</a></td>
          <td class="govuk-table__cell">22 Mill Street, SW3 5DD</td>
          <td class="govuk-table__cell">Lawful development</td>
          <td class="govuk-table__cell">
            <strong class="govuk-tag govuk-tag--yellow govuk-tag--status-amendments_needed">Amendments needed</strong>
          </td>
          <td class="govuk-table__cell">James Lee</td>
        </tr>
        <tr class="govuk-table__row">
          <td class="govuk-table__cell"><a class="govuk-link" href="#">BPS-24-00127</a></td>
          <td class="govuk-table__cell">1 Victoria Gardens, W1 6EE</td>
          <td class="govuk-table__cell">Householder</td>
          <td class="govuk-table__cell">
            <strong class="govuk-tag govuk-tag--red govuk-tag--status-refused">Refused</strong>
          </td>
          <td class="govuk-table__cell">Mark Thompson</td>
        </tr>
      </tbody>
    </table>
  `,
};
