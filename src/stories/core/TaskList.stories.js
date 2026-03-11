/**
 * GOV.UK task list pattern used in BOPS to track the stages of an application.
 * Each task shows its name and a status tag indicating progress.
 */
export default {
  title: "Core/Task List",
};

export const AssessmentTasks = {
  render: () => `
    <ul class="govuk-task-list">
      <li class="govuk-task-list__item govuk-task-list__item--with-link">
        <div class="govuk-task-list__name-and-hint">
          <a class="govuk-link govuk-task-list__link" href="#">Check and assess</a>
        </div>
        <div class="govuk-task-list__status">
          <strong class="govuk-tag govuk-tag--light-blue govuk-tag--status-in_progress">In progress</strong>
        </div>
      </li>
      <li class="govuk-task-list__item govuk-task-list__item--with-link">
        <div class="govuk-task-list__name-and-hint">
          <a class="govuk-link govuk-task-list__link" href="#">Consultees</a>
        </div>
        <div class="govuk-task-list__status">
          <strong class="govuk-tag govuk-tag--green govuk-tag--status-complete">Complete</strong>
        </div>
      </li>
      <li class="govuk-task-list__item govuk-task-list__item--with-link">
        <div class="govuk-task-list__name-and-hint">
          <a class="govuk-link govuk-task-list__link" href="#">Neighbour responses</a>
        </div>
        <div class="govuk-task-list__status">
          <strong class="govuk-tag govuk-tag--yellow govuk-tag--status-updated">Updated</strong>
        </div>
      </li>
      <li class="govuk-task-list__item govuk-task-list__item--with-link">
        <div class="govuk-task-list__name-and-hint">
          <a class="govuk-link govuk-task-list__link" href="#">Make a recommendation</a>
        </div>
        <div class="govuk-task-list__status">
          <strong class="govuk-tag govuk-tag--blue govuk-tag--status-not_started">Not started</strong>
        </div>
      </li>
      <li class="govuk-task-list__item">
        <div class="govuk-task-list__name-and-hint">
          Review and submit
        </div>
        <div class="govuk-task-list__status govuk-task-list__status--cannot-start-yet">
          <strong class="govuk-tag govuk-tag--grey govuk-tag--status-cannot_start_yet">Cannot start yet</strong>
        </div>
      </li>
    </ul>
  `,
};

export const AllComplete = {
  render: () => `
    <ul class="govuk-task-list">
      <li class="govuk-task-list__item govuk-task-list__item--with-link">
        <div class="govuk-task-list__name-and-hint">
          <a class="govuk-link govuk-task-list__link" href="#">Check and assess</a>
        </div>
        <div class="govuk-task-list__status">
          <strong class="govuk-tag govuk-tag--green govuk-tag--status-complete">Complete</strong>
        </div>
      </li>
      <li class="govuk-task-list__item govuk-task-list__item--with-link">
        <div class="govuk-task-list__name-and-hint">
          <a class="govuk-link govuk-task-list__link" href="#">Consultees</a>
        </div>
        <div class="govuk-task-list__status">
          <strong class="govuk-tag govuk-tag--green govuk-tag--status-complete">Complete</strong>
        </div>
      </li>
      <li class="govuk-task-list__item govuk-task-list__item--with-link">
        <div class="govuk-task-list__name-and-hint">
          <a class="govuk-link govuk-task-list__link" href="#">Neighbour responses</a>
        </div>
        <div class="govuk-task-list__status">
          <strong class="govuk-tag govuk-tag--green govuk-tag--status-complete">Complete</strong>
        </div>
      </li>
      <li class="govuk-task-list__item govuk-task-list__item--with-link">
        <div class="govuk-task-list__name-and-hint">
          <a class="govuk-link govuk-task-list__link" href="#">Make a recommendation</a>
        </div>
        <div class="govuk-task-list__status">
          <strong class="govuk-tag govuk-tag--green govuk-tag--status-complete">Complete</strong>
        </div>
      </li>
      <li class="govuk-task-list__item govuk-task-list__item--with-link">
        <div class="govuk-task-list__name-and-hint">
          <a class="govuk-link govuk-task-list__link" href="#">Review and submit</a>
        </div>
        <div class="govuk-task-list__status">
          <strong class="govuk-tag govuk-tag--green govuk-tag--status-complete">Complete</strong>
        </div>
      </li>
    </ul>
  `,
};
