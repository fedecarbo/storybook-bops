/**
 * Shared mock data for all BOPS Storybook stories.
 *
 * Import what you need:
 *   import { mockData } from '../helpers';
 *
 * Add new entries here when a task needs data not yet covered.
 * Keep data realistic — use actual GOV.UK / planning terminology.
 */
export const mockData = {
  application: {
    reference: "BPS-24-00345-HAPP",
    type: "Householder planning permission",
    typeShort: "Householder",
    legislationTitle: "Town and Country Planning Act 1990",
    description:
      "Proposed two-storey rear extension measuring approximately 4 metres in depth and 6 metres in width to provide enlarged kitchen and dining area on the ground floor with additional bedroom and en-suite bathroom on the first floor. Materials to match existing dwelling including London stock brick and slate roof tiles.",
    descriptionShort:
      "Two-storey rear extension to provide enlarged kitchen/dining area and additional bedroom.",
    address: {
      full: "12 Elm Grove, London, SE15 5DE",
      street: "12 Elm Grove",
      town: "London",
      postcode: "SE15 5DE",
    },
    ward: "Borough and Bankside",
    parish: "Camberwell",
    uprn: "100023589104",
    status: "in_progress",
    councilName: "Southwark Council",
    serviceName: "Back Office Planning System",
  },

  people: {
    applicant: {
      name: "James Morton",
      email: "james.morton@example.com",
      phone: "07700 900123",
      role: "Owner",
    },
    agent: {
      name: "ABC Architecture Ltd",
      contactName: "Helen Clarke",
      email: "helen@abcarchitecture.co.uk",
      phone: "020 7946 0958",
    },
    caseOfficer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@southwark.gov.uk",
    },
    reviewer: {
      name: "Mark Thompson",
      email: "mark.thompson@southwark.gov.uk",
    },
  },

  dates: {
    received: "15 November 2024",
    validated: "22 November 2024",
    consultationStart: "25 November 2024",
    consultationEnd: "16 December 2024",
    targetDecision: "10 January 2025",
    expiryDate: "14 February 2025",
  },

  documents: [
    { name: "Application form", tags: ["Plans"], uploadedAt: "15 Nov 2024" },
    { name: "Site location plan", tags: ["Plans"], uploadedAt: "15 Nov 2024" },
    {
      name: "Existing floor plans",
      tags: ["Plans"],
      uploadedAt: "15 Nov 2024",
    },
    {
      name: "Proposed floor plans",
      tags: ["Plans"],
      uploadedAt: "15 Nov 2024",
    },
    {
      name: "Existing and proposed elevations",
      tags: ["Plans"],
      uploadedAt: "15 Nov 2024",
    },
    {
      name: "Design and access statement",
      tags: ["Supporting document"],
      uploadedAt: "15 Nov 2024",
    },
    {
      name: "Heritage statement",
      tags: ["Supporting document"],
      uploadedAt: "15 Nov 2024",
    },
    {
      name: "Photographs of existing property",
      tags: ["Evidence"],
      uploadedAt: "15 Nov 2024",
    },
  ],

  constraints: [
    {
      type: "Conservation area",
      name: "Camberwell Green Conservation Area",
      source: "Planning data",
    },
    {
      type: "Listed building",
      name: "Grade II listed",
      source: "Planning data",
    },
    {
      type: "Article 4 direction",
      name: "Camberwell Article 4",
      source: "Planning data",
    },
    {
      type: "Tree preservation order",
      name: "TPO 456 — Oak tree, rear garden",
      source: "Planning data",
    },
    {
      type: "Flood zone",
      name: "Flood Zone 2",
      source: "Environment Agency",
    },
    {
      type: "Archaeological priority area",
      name: "Camberwell APA",
      source: "Planning data",
    },
  ],

  consultees: [
    {
      name: "Conservation Officer",
      organisation: "Southwark Council",
      email: "conservation@southwark.gov.uk",
      status: "awaiting_response",
      sentAt: "25 Nov 2024",
    },
    {
      name: "Tree Officer",
      organisation: "Southwark Council",
      email: "trees@southwark.gov.uk",
      status: "no_response",
      sentAt: "25 Nov 2024",
    },
    {
      name: "Highways Authority",
      organisation: "Transport for London",
      email: "highways@tfl.gov.uk",
      status: "complete",
      sentAt: "25 Nov 2024",
      respondedAt: "5 Dec 2024",
      response: "No objection",
    },
    {
      name: "Environment Agency",
      organisation: "Environment Agency",
      email: "planning@environment-agency.gov.uk",
      status: "awaiting_response",
      sentAt: "25 Nov 2024",
    },
    {
      name: "Thames Water",
      organisation: "Thames Water Utilities",
      email: "planning@thameswater.co.uk",
      status: "complete",
      sentAt: "25 Nov 2024",
      respondedAt: "2 Dec 2024",
      response: "No objection subject to conditions",
    },
  ],

  neighbours: [
    {
      address: "10 Elm Grove, London, SE15 5DE",
      name: "R. Patel",
      status: "no_response",
    },
    {
      address: "14 Elm Grove, London, SE15 5DE",
      name: "S. O'Brien",
      status: "objection",
    },
    {
      address: "11 Elm Grove, London, SE15 5DD",
      name: "K. Williams",
      status: "supportive",
    },
    {
      address: "13 Elm Grove, London, SE15 5DD",
      name: "A. Nguyen",
      status: "no_response",
    },
    {
      address: "10A Elm Grove, London, SE15 5DE",
      name: "D. Brown",
      status: "neutral",
    },
    {
      address: "16 Elm Grove, London, SE15 5DE",
      name: "M. Singh",
      status: "no_response",
    },
    {
      address: "12A Elm Grove, London, SE15 5DE",
      name: "J. Taylor",
      status: "no_response",
    },
    {
      address: "8 Elm Grove, London, SE15 5DE",
      name: "C. Evans",
      status: "objection",
    },
  ],

  fee: {
    amount: "206.00",
    paymentReference: "PAY-2024-09876",
    paymentMethod: "Online",
    exempt: false,
  },

  siteHistory: [
    {
      reference: "BPS-19-00789-HAPP",
      description: "Single-storey rear extension",
      decision: "Approved",
      date: "12 March 2019",
    },
    {
      reference: "BPS-21-01234-HAPP",
      description: "Loft conversion with rear dormer",
      decision: "Refused",
      date: "8 July 2021",
    },
  ],

  conditions: [
    {
      number: 1,
      title: "Time limit",
      text: "The development hereby permitted shall be begun before the expiration of three years from the date of this permission.",
    },
    {
      number: 2,
      title: "Approved plans",
      text: "The development hereby permitted shall be carried out in accordance with the approved plans listed in the schedule.",
    },
    {
      number: 3,
      title: "Materials",
      text: "The materials to be used in the construction of the external surfaces of the development hereby permitted shall match those of the existing building.",
    },
  ],

  policyReferences: [
    {
      code: "DM1",
      title: "Development management policy DM1: Quality of development",
      area: "Local plan",
    },
    {
      code: "DM2",
      title: "Development management policy DM2: Amenity",
      area: "Local plan",
    },
    {
      code: "P15",
      title: "Policy P15: Residential design",
      area: "Southwark Plan",
    },
    {
      code: "NPPF",
      title: "National Planning Policy Framework, Chapter 12",
      area: "National",
    },
  ],

  // Structured task list matching the source YAML at
  // ~/Documents/test5/config/task_workflows/planning_permission.yml
  validationTasks: {
    title: "Validation tasks",
    subsections: [
      {
        title: "Check, tag, and confirm documents",
        tasks: [
          {
            name: "Review documents",
            slug: "review-documents",
            status: "not_started",
          },
          {
            name: "Check and request documents",
            slug: "check-and-request-documents",
            status: "not_started",
          },
        ],
      },
      {
        title: "Check application details",
        tasks: [
          {
            name: "Check red line boundary",
            slug: "check-red-line-boundary",
            status: "not_started",
          },
          {
            name: "Check constraints",
            slug: "check-constraints",
            status: "not_started",
          },
          {
            name: "Check description",
            slug: "check-description",
            status: "not_started",
          },
          {
            name: "Check fee",
            slug: "check-fee",
            status: "not_started",
          },
          {
            name: "Add reporting details",
            slug: "add-reporting-details",
            status: "not_started",
          },
        ],
      },
      {
        title: "Confirm application requirements",
        tasks: [
          {
            name: "Confirm Community Infrastructure Levy (CIL)",
            slug: "confirm-cil",
            status: "not_started",
          },
          {
            name: "Check Environment Impact Assessment",
            slug: "check-eia",
            status: "not_started",
          },
          {
            name: "Check ownership certificate",
            slug: "check-ownership-certificate",
            status: "not_started",
          },
        ],
      },
      {
        title: "Other validation issues",
        tasks: [
          {
            name: "Other validation requests",
            slug: "other-validation-requests",
            status: "not_started",
          },
        ],
      },
      {
        title: "Review",
        tasks: [
          {
            name: "Review validation requests",
            slug: "review-validation-requests",
            status: "not_started",
          },
          {
            name: "Send validation decision",
            slug: "send-validation-decision",
            status: "not_started",
          },
        ],
      },
    ],
  },
};
