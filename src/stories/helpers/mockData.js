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
    {
      name: "Application form",
      filename: "application-form.pdf",
      tags: [],
      uploadedAt: "15 Nov 2024",
      publishable: true,
      redacted: false,
      status: "not_started",
      applicantDescription: "Completed application form for proposed rear extension",
    },
    {
      name: "Site location plan",
      filename: "site-location-plan.pdf",
      tags: ["locationPlan"],
      uploadedAt: "15 Nov 2024",
      publishable: true,
      redacted: false,
      status: "not_started",
      applicantDescription: "1:1250 scale location plan showing site outlined in red",
    },
    {
      name: "Existing floor plans",
      filename: "existing-floor-plans.pdf",
      tags: ["floorPlan.existing"],
      uploadedAt: "15 Nov 2024",
      publishable: true,
      redacted: false,
      status: "not_started",
      applicantDescription: "Ground and first floor plans as existing",
    },
    {
      name: "Proposed floor plans",
      filename: "proposed-floor-plans.pdf",
      tags: ["floorPlan.proposed"],
      uploadedAt: "15 Nov 2024",
      publishable: true,
      redacted: false,
      status: "not_started",
      applicantDescription: "Ground and first floor plans as proposed",
    },
    {
      name: "Existing and proposed elevations",
      filename: "elevations.pdf",
      tags: ["elevations.existing", "elevations.proposed"],
      uploadedAt: "15 Nov 2024",
      publishable: true,
      redacted: false,
      status: "not_started",
      applicantDescription: "Front, rear and side elevations showing existing and proposed",
    },
    {
      name: "Design and access statement",
      filename: "design-access-statement.pdf",
      tags: ["designAndAccessStatement"],
      uploadedAt: "15 Nov 2024",
      publishable: true,
      redacted: false,
      status: "not_started",
      applicantDescription: "Design and access statement for the proposed development",
    },
    {
      name: "Heritage statement",
      filename: "heritage-statement.pdf",
      tags: ["heritageStatement"],
      uploadedAt: "15 Nov 2024",
      publishable: true,
      redacted: false,
      status: "not_started",
      applicantDescription: "Heritage impact assessment for works to Grade II listed building",
    },
    {
      name: "Photographs of existing property",
      filename: "photographs-existing.pdf",
      tags: ["photographs.existing"],
      uploadedAt: "15 Nov 2024",
      publishable: false,
      redacted: false,
      status: "not_started",
      applicantDescription: "Photos showing current condition of rear elevation and garden",
    },
  ],

  // Document tag key → human-readable label (from document_tags.yml)
  documentTagLabels: {
    "locationPlan": "Location plan",
    "floorPlan.existing": "Floor plan - existing",
    "floorPlan.proposed": "Floor plan - proposed",
    "elevations.existing": "Elevations - existing",
    "elevations.proposed": "Elevations - proposed",
    "designAndAccessStatement": "Design and Access Statement",
    "heritageStatement": "Heritage Statement",
    "photographs.existing": "Photographs - existing",
    "photographs.proposed": "Photographs - proposed",
    "sitePlan.existing": "Site plan - existing",
    "sitePlan.proposed": "Site plan - proposed",
    "roofPlan.existing": "Roof plan - existing",
    "roofPlan.proposed": "Roof plan - proposed",
    "sections.existing": "Sections - existing",
    "sections.proposed": "Sections - proposed",
    "internalElevations": "Internal elevations",
    "streetScene": "Street scene drawing",
    "otherDrawing": "Other - drawing",
    "bankStatement": "Bank statement",
    "councilTaxBill": "Council tax bill",
    "buildingControlCertificate": "Building control certificate",
    "constructionInvoice": "Construction invoice",
    "otherEvidence": "Other - evidence or correspondence",
    "ecologyReport": "Ecology report",
    "floodRiskAssessment": "Flood risk assessment (FRA)",
    "planningStatement": "Planning statement",
    "contaminationReport": "Contamination report",
    "energyStatement": "Energy statement",
    "otherSupporting": "Other - supporting document",
    "otherDocument": "Other - document",
  },

  // Tag groups for the document edit form tabs
  documentTagGroups: {
    drawings: {
      label: "Drawings",
      hint: "Select the relevant drawing tags",
      tags: [
        { key: "elevations.existing", label: "Elevations - existing" },
        { key: "elevations.proposed", label: "Elevations - proposed" },
        { key: "floorPlan.existing", label: "Floor plan - existing" },
        { key: "floorPlan.proposed", label: "Floor plan - proposed" },
        { key: "locationPlan", label: "Location plan" },
        { key: "roofPlan.existing", label: "Roof plan - existing" },
        { key: "roofPlan.proposed", label: "Roof plan - proposed" },
        { key: "sections.existing", label: "Sections - existing" },
        { key: "sections.proposed", label: "Sections - proposed" },
        { key: "sitePlan.existing", label: "Site plan - existing" },
        { key: "sitePlan.proposed", label: "Site plan - proposed" },
        { key: "streetScene", label: "Street scene drawing" },
        { key: "otherDrawing", label: "Other - drawing" },
      ],
    },
    evidence: {
      label: "Evidence",
      hint: "Select the relevant evidence tags",
      tags: [
        { key: "photographs.existing", label: "Photographs - existing" },
        { key: "photographs.proposed", label: "Photographs - proposed" },
        { key: "bankStatement", label: "Bank statement" },
        { key: "councilTaxBill", label: "Council tax bill" },
        { key: "buildingControlCertificate", label: "Building control certificate" },
        { key: "constructionInvoice", label: "Construction invoice" },
        { key: "otherEvidence", label: "Other - evidence or correspondence" },
      ],
    },
    supportingDocuments: {
      label: "Supporting documents",
      hint: "Select the relevant supporting document tags",
      tags: [
        { key: "designAndAccessStatement", label: "Design and Access Statement" },
        { key: "heritageStatement", label: "Heritage Statement" },
        { key: "ecologyReport", label: "Ecology report" },
        { key: "floodRiskAssessment", label: "Flood risk assessment (FRA)" },
        { key: "planningStatement", label: "Planning statement" },
        { key: "contaminationReport", label: "Contamination report" },
        { key: "energyStatement", label: "Energy statement" },
        { key: "otherSupporting", label: "Other - supporting document" },
      ],
    },
  },

  constraints: [
    {
      type: "Conservation area",
      name: "Camberwell Green Conservation Area",
      category: "Heritage and conservation",
      source: "Planning data",
      identified: true,
      identifiedBy: "PlanX",
      entities: [{ name: "Camberwell Green Conservation Area", id: "44006857" }],
    },
    {
      type: "Listed building",
      name: "Grade II listed",
      category: "Heritage and conservation",
      source: "Planning data",
      identified: true,
      identifiedBy: "PlanX",
      entities: [{ name: "12 Elm Grove — Grade II", id: "1065832" }],
    },
    {
      type: "Article 4 direction",
      name: "Camberwell Article 4",
      category: "General policy",
      source: "Planning data",
      identified: true,
      identifiedBy: "PlanX",
      entities: [{ name: "Camberwell Article 4 Direction Area", id: "7010002614" }],
    },
    {
      type: "Tree preservation order",
      name: "TPO 456 — Oak tree, rear garden",
      category: "Trees",
      source: "Planning data",
      identified: true,
      identifiedBy: "PlanX",
      entities: [{ name: "TPO 456", id: "7010000456" }],
    },
    {
      type: "Flood zone",
      name: "Flood Zone 2",
      category: "General policy",
      source: "Environment Agency",
      identified: true,
      identifiedBy: "PlanX",
      entities: [],
    },
    {
      type: "Archaeological priority area",
      name: "Camberwell APA",
      category: "Heritage and conservation",
      source: "Planning data",
      identified: true,
      identifiedBy: "PlanX",
      entities: [{ name: "Camberwell Archaeological Priority Area", id: "7010003201" }],
    },
  ],

  // Additional constraints available to search and add (not yet on the application)
  availableConstraints: [
    {
      type: "Smoke control area",
      category: "General policy",
      name: "Southwark Smoke Control Area",
    },
    {
      type: "Air quality management area",
      category: "General policy",
      name: "Southwark AQMA",
    },
    {
      type: "Site of importance for nature conservation",
      category: "Ecology",
      name: "SINC — Burgess Park",
    },
    {
      type: "Ancient woodland",
      category: "Ecology",
      name: "Ancient Semi-Natural Woodland",
    },
  ],

  consultees: [
    {
      name: "Conservation Officer",
      organisation: "Southwark Council",
      email: "conservation@southwark.gov.uk",
      origin: "internal",
      role: "Conservation and design",
      constraints: ["Conservation area", "Listed building"],
      status: "awaiting_response",
      sentAt: "25 Nov 2024",
    },
    {
      name: "Tree Officer",
      organisation: "Southwark Council",
      email: "trees@southwark.gov.uk",
      origin: "internal",
      role: "Arboriculture",
      constraints: ["Tree preservation order"],
      status: "no_response",
      sentAt: "25 Nov 2024",
    },
    {
      name: "Highways Authority",
      organisation: "Transport for London",
      email: "highways@tfl.gov.uk",
      origin: "external",
      role: "Highways",
      constraints: [],
      status: "complete",
      sentAt: "25 Nov 2024",
      respondedAt: "5 Dec 2024",
      response: "No objection",
    },
    {
      name: "Environment Agency",
      organisation: "Environment Agency",
      email: "planning@environment-agency.gov.uk",
      origin: "external",
      role: "Regulatory body",
      constraints: ["Flood zone"],
      status: "awaiting_response",
      sentAt: "25 Nov 2024",
    },
    {
      name: "Thames Water",
      organisation: "Thames Water Utilities",
      email: "planning@thameswater.co.uk",
      origin: "external",
      role: "Statutory undertaker",
      constraints: ["Flood zone"],
      status: "complete",
      sentAt: "25 Nov 2024",
      respondedAt: "2 Dec 2024",
      response: "No objection subject to conditions",
    },
  ],

  // Consultee responses — one response per consultee with realistic planning content
  consulteeResponses: [
    {
      consultee: "Conservation Officer",
      name: "Dr. Sarah Whitfield",
      email: "conservation@southwark.gov.uk",
      receivedAt: "3 December 2024",
      summaryTag: "approved",
      response:
        "Having reviewed the submitted plans and heritage statement, I can confirm that the proposed two-storey rear extension will not cause harm to the significance of the Camberwell Grove Conservation Area. The proposed materials — London stock brick and slate roof tiles — are appropriate and will match the existing dwelling. The scale and massing are subordinate to the host building. I have no objection to this application.",
      redactedResponse: "",
      published: false,
      documents: [],
    },
    {
      consultee: "Tree Officer",
      name: "Mark Reynolds",
      email: "trees@southwark.gov.uk",
      receivedAt: "1 December 2024",
      summaryTag: "amendments_needed",
      response:
        "The proposed extension is within the root protection area of a mature London plane tree (T3) protected under TPO/2019/0045. The submitted arboricultural impact assessment does not adequately address potential root damage during excavation for the new foundations. I request that the applicant provides a revised foundation design using pile-and-beam construction to avoid root severance, along with an updated arboricultural method statement. Subject to these amendments, the scheme may be acceptable.",
      redactedResponse: "",
      published: false,
      documents: ["Arboricultural-Assessment-Review.pdf"],
    },
    {
      consultee: "Highways Authority",
      name: "James Thornton",
      email: "highways@tfl.gov.uk",
      receivedAt: "5 December 2024",
      summaryTag: "approved",
      response: "The proposal does not affect the public highway. No objection.",
      redactedResponse:
        "The proposal does not affect the public highway. No objection.",
      published: true,
      documents: [],
    },
    {
      consultee: "Environment Agency",
      name: "Claire Dawson",
      email: "planning@environment-agency.gov.uk",
      receivedAt: "8 December 2024",
      summaryTag: "objected",
      response:
        "The site falls partly within Flood Zone 2. The submitted flood risk assessment is not adequate as it does not include a sequential test or demonstrate that the development will not increase flood risk elsewhere. We object to this application until a satisfactory flood risk assessment is provided that addresses surface water drainage, finished floor levels, and flood resilient construction measures.",
      redactedResponse: "",
      published: false,
      documents: ["EA-Standard-Response-Flood-Zone.pdf"],
    },
    {
      consultee: "Thames Water",
      name: "Planning Team",
      email: "planning@thameswater.co.uk",
      receivedAt: "2 December 2024",
      summaryTag: "approved",
      response:
        "Thames Water has no objection to the above application with regard to waste water network and sewage treatment works infrastructure capacity. We recommend an informative be attached to any planning permission advising the developer to contact Thames Water regarding connection to the sewer network.",
      redactedResponse:
        "Thames Water has no objection to the above application with regard to waste water network and sewage treatment works infrastructure capacity. We recommend an informative be attached to any planning permission advising the developer to contact Thames Water regarding connection to the sewer network.",
      published: true,
      documents: [],
    },
  ],

  // Additional consultees available to search and add (not yet assigned to this application)
  availableConsultees: [
    {
      name: "Historic England",
      organisation: "Historic England",
      email: "london@historicengland.org.uk",
      origin: "external",
      role: "Statutory consultee",
    },
    {
      name: "Ecology Officer",
      organisation: "Southwark Council",
      email: "ecology@southwark.gov.uk",
      origin: "internal",
      role: "Ecology and biodiversity",
    },
    {
      name: "Metropolitan Police",
      organisation: "Metropolitan Police — Designing Out Crime",
      email: "designing.out.crime@met.police.uk",
      origin: "external",
      role: "Designing out crime",
    },
  ],

  neighbours: [
    {
      address: "10 Elm Grove, London, SE15 5DE",
      name: "R. Patel",
      status: "no_response",
      source: "map_selection",
      letterStatus: "new",
      lastContacted: null,
      selected: true,
    },
    {
      address: "14 Elm Grove, London, SE15 5DE",
      name: "S. O'Brien",
      status: "objection",
      source: "map_selection",
      letterStatus: "new",
      lastContacted: null,
      selected: true,
    },
    {
      address: "11 Elm Grove, London, SE15 5DD",
      name: "K. Williams",
      status: "supportive",
      source: "map_selection",
      letterStatus: "new",
      lastContacted: null,
      selected: true,
    },
    {
      address: "13 Elm Grove, London, SE15 5DD",
      name: "A. Nguyen",
      status: "no_response",
      source: "manual_add",
      letterStatus: "new",
      lastContacted: null,
      selected: true,
    },
    {
      address: "10A Elm Grove, London, SE15 5DE",
      name: "D. Brown",
      status: "neutral",
      source: "map_selection",
      letterStatus: "new",
      lastContacted: null,
      selected: true,
    },
    {
      address: "16 Elm Grove, London, SE15 5DE",
      name: "M. Singh",
      status: "no_response",
      source: "map_selection",
      letterStatus: "new",
      lastContacted: null,
      selected: true,
    },
    {
      address: "12A Elm Grove, London, SE15 5DE",
      name: "J. Taylor",
      status: "no_response",
      source: "manual_add",
      letterStatus: "new",
      lastContacted: null,
      selected: true,
    },
    {
      address: "8 Elm Grove, London, SE15 5DE",
      name: "C. Evans",
      status: "objection",
      source: "map_selection",
      letterStatus: "new",
      lastContacted: null,
      selected: true,
    },
  ],

  fee: {
    amount: "206.00",
    paymentReference: "PAY-2024-09876",
    paymentMethod: "Online",
    exempt: false,
    sessionId: "sess-planx-abc123def",
    calculation: {
      applicationFee: "462.00",
      exemptions: ["Disability exemption"],
      reductions: [],
      discount: "256.00",
      total: "206.00",
    },
  },

  feeChangeRequest: {
    reason:
      "The fee paid does not match the fee required for this type of application. A householder application for a rear extension requires a fee of £258.00, but only £206.00 was received.",
    suggestion:
      "Please pay the outstanding balance of £52.00 to make the fee valid. If you believe you are exempt from the fee, please provide documents to support your fee exemption.",
    response:
      "I have now paid the outstanding balance of £52.00 via the online portal. The new payment reference is PAY-2024-09912.",
    invalidAmount: "206.00",
    createdAt: "15 January 2025",
    responseDue: "22 January 2025",
    respondedAt: "18 January 2025",
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

  // Press notice reason labels (from press_notice_reasons.yml)
  pressNoticeReasons: {
    conservation_area:
      "The site is within/affecting the setting of a designated Conservation Area (Section 73)",
    listed_building:
      "The application relates to, or affects the setting of a Listed Building (Section 67)",
    major_development: "The application is for a Major Development",
    wildlife_and_countryside:
      "The application would affect a right of way (Part III of Wildlife and Countryside Act 1981)",
    development_plan:
      "The application does not accord with the provisions of the development plan",
    environment:
      "An environmental statement accompanies this application",
    ancient_monument:
      "The site is affecting the setting of an Ancient Monument",
    public_interest: "Wider Public interest",
    other: "Other",
  },

  // Press notice mock state
  pressNotice: {
    required: true,
    reasons: ["conservation_area", "listed_building"],
    otherReason: "",
    requestedAt: "26 Nov 2024",
    publishedAt: "2 Dec 2024",
    comment: "Published in Southwark News, page 12",
    evidenceFilename: "press-notice-southwark-news.jpg",
    evidenceUploadedAt: "3 Dec 2024",
    notificationEmail: "press.notices@southwark.gov.uk",
  },

  // Site notice mock state
  siteNotice: {
    required: true,
    quantity: 2,
    locationInstructions:
      "Display one notice on the lamppost outside 12 Elm Grove on Elm Grove road, and one on the fence panel facing the public footpath at the rear of the property.",
    method: "internal_team",
    internalTeamEmail: "site.notices@southwark.gov.uk",
    createdAt: "27 Nov 2024",
    displayedAt: "29 Nov 2024",
    expiryDate: "20 Dec 2024",
    evidenceFilename: "site-notice-photo-elm-grove.jpg",
    evidenceUploadedAt: "30 Nov 2024",
    pdfLink: "#",
  },

  // Additional document validation requests — requested by case officer during validation
  documentRequests: [
    {
      id: 1,
      documentRequestType: "Existing roof plan",
      reason:
        "The submitted drawings do not include a roof plan showing the existing layout. This is needed to assess the impact of the proposed rear extension on the roof structure. Please provide a roof plan at 1:50 scale showing the existing roof layout.",
      state: "open",
      createdAt: "18 Nov 2024 10:32",
      responseDue: "9 December 2024",
      closedAt: null,
      responseDocuments: [],
    },
    {
      id: 2,
      documentRequestType: "Structural survey report",
      reason:
        "Given the proximity to the party wall and the proposed two-storey extension, a structural survey report is required to demonstrate the works will not affect the structural integrity of the adjoining property.",
      state: "open",
      createdAt: "18 Nov 2024 10:45",
      responseDue: "9 December 2024",
      closedAt: null,
      responseDocuments: [],
    },
    {
      id: 3,
      documentRequestType: "Tree survey / Arboricultural impact assessment",
      reason:
        "The site has a Tree Preservation Order (TPO 456). An arboricultural impact assessment is required showing the root protection areas of the protected oak tree and the impact of the proposed foundations.",
      state: "closed",
      createdAt: "18 Nov 2024 11:00",
      responseDue: "9 December 2024",
      closedAt: "25 Nov 2024 14:22",
      responseDocuments: [
        {
          name: "Arboricultural impact assessment",
          filename: "arboricultural-impact-assessment.pdf",
          uploadedAt: "25 Nov 2024",
        },
      ],
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

  // Red line boundary change request data
  redLineBoundary: {
    changeRequest: {
      reason:
        "The submitted red line boundary does not include the full extent of the rear garden where the proposed extension will be built. The boundary needs to be extended to include the area up to the rear fence line to accurately show the application site.",
      createdAt: "19 November 2024, 14:30",
      responseDue: "10 December 2024",
      updatedAt: "25 November 2024, 09:15",
      rejectionReason:
        "I believe the original boundary is correct as the extension does not extend beyond the current patio area which is already within the red line.",
    },
  },

  // Reporting types for the "Add reporting details" task
  // Filtered by application type — householder apps see Q21 as the main option
  reportingTypes: [
    {
      id: 1,
      code: "Q21",
      description: "Householder developments",
      fullDescription: "Q21 – Householder developments",
      guidance:
        "Includes extensions, conservatories, loft conversions, garages, and other alterations to a single dwellinghouse.",
      guidanceLink:
        "https://www.gov.uk/guidance/making-an-application#householder-702",
    },
    {
      id: 2,
      code: "Q13",
      description: "Dwellings (minor)",
      fullDescription: "Q13 – Dwellings (minor)",
      guidance:
        "Development of 1–9 dwellings or a site area of less than 0.5 hectares where the number of dwellings is not known.",
    },
    {
      id: 3,
      code: "Q18",
      description: "All other developments (minor)",
      fullDescription: "Q18 – All other developments (minor)",
    },
    {
      id: 4,
      code: "Q20",
      description: "Change of use",
      fullDescription: "Q20 – Change of use",
      legislation: "Town and Country Planning (Use Classes) Order 1987",
    },
  ],

  // CIL (Community Infrastructure Levy) data from PlanX submission
  cilLiability: {
    proposedFloorArea: "45", // net square metres
    result: "liable", // PlanX result: "liable", "exempt.size", or null
  },

  // Environment Impact Assessment data
  eia: {
    required: true,
    emailAddress: "eia.requests@southwark.gov.uk",
    address:
      "Planning Department, Southwark Council, 160 Tooley Street, London, SE1 2QH",
    fee: "15",
  },

  // Ownership certificate data
  ownershipCertificate: {
    certificateType: "B",
    landOwners: [
      {
        name: "Margaret Thornton",
        address: "14 Elm Grove, London, SE15 5DE",
        noticeGiven: true,
        noticeGivenAt: "01/10/2024",
        noticeReason: null,
      },
      {
        name: "David Thornton",
        address: "14 Elm Grove, London, SE15 5DE",
        noticeGiven: true,
        noticeGivenAt: "01/10/2024",
        noticeReason: null,
      },
    ],
    updatedCertificate: {
      certificateType: "C",
      landOwners: [
        {
          name: "Margaret Thornton",
          address: "14 Elm Grove, London, SE15 5DE",
          noticeGiven: true,
          noticeGivenAt: "15/11/2024",
          noticeReason: null,
        },
        {
          name: "David Thornton",
          address: "14 Elm Grove, London, SE15 5DE",
          noticeGiven: true,
          noticeGivenAt: "15/11/2024",
          noticeReason: null,
        },
        {
          name: "Southwark Estates Ltd",
          address: "Unit 3, Business Park, London, SE1 4QP",
          noticeGiven: false,
          noticeGivenAt: null,
          noticeReason:
            "Unable to identify individual to serve notice upon — company registered address used",
        },
      ],
    },
    certificateTypeA: {
      certificateType: "A",
      landOwners: [],
    },
    certificateTypeD: {
      certificateType: "D",
      landOwners: [
        {
          name: "Unknown",
          address: "Part rear garden, 12 Elm Grove, London, SE15 5DE",
          noticeGiven: false,
          noticeGivenAt: null,
          noticeReason:
            "Owner could not be identified after reasonable enquiry. Notice published in local newspaper on 20/09/2024.",
        },
      ],
    },
    changeRequest: {
      reason:
        "The submitted ownership certificate states Certificate Type B, but records indicate there may be additional landowners whose interest in the land has not been declared. The rear boundary appears to include land belonging to the adjacent property at 14 Elm Grove. Please review and submit a corrected ownership certificate.",
      createdAt: "20 November 2024",
      createdAtShort: "20/11/2024",
      responseDue: "11 December 2024",
      closedAt: "28 November 2024",
    },
    rejectionReason:
      "I disagree with this assessment. The land at 14 Elm Grove is not included in the application boundary. The red line boundary only covers the property at 12 Elm Grove, of which I am the sole owner along with David Thornton as listed in the original certificate.",
    activityLogRequests: [
      {
        action: "Certificate submitted by applicant",
        status: "Submitted",
        user: "Applicant",
        date: "28/11/2024",
      },
      {
        action: "New ownership certificate requested",
        status: "Closed",
        user: "Sarah Johnson",
        date: "20/11/2024",
      },
    ],
  },

  // Other change validation requests — generic catch-all for any validation issue
  // not covered by specific request types (documents, description, boundary, etc.)
  otherChangeRequests: [
    {
      id: 1,
      sequence: 1,
      reason:
        "The application does not include details of the proposed materials for the external walls and roof of the extension. This information is required to assess the visual impact on the conservation area.",
      suggestion:
        "Please provide a schedule of materials specifying the type, colour, and finish of all external materials for the proposed extension, including walls, roof, windows, and doors.",
      state: "open",
      response: null,
      createdAt: "20 Nov 2024 11:15",
      responseDue: "11 December 2024",
      closedAt: null,
    },
    {
      id: 2,
      sequence: 2,
      reason:
        "The submitted CIL Additional Information form appears to be incomplete — the floor area calculations for the existing and proposed development have not been filled in.",
      suggestion:
        "Please complete the CIL Additional Information form with the gross internal area (GIA) of the existing building and proposed development in square metres.",
      state: "open",
      response: null,
      createdAt: "20 Nov 2024 11:30",
      responseDue: "11 December 2024",
      closedAt: null,
    },
    {
      id: 3,
      sequence: 3,
      reason:
        "The ownership certificate submitted with the application is Certificate A, but Land Registry records indicate that a portion of the access driveway is owned by a third party. Certificate B may be required.",
      suggestion:
        "Please check the Land Registry title and confirm whether all land within the red line boundary is in your sole ownership. If not, you will need to submit an amended ownership certificate (Certificate B) and serve notice on the other landowner(s).",
      state: "closed",
      response:
        "I have checked the Land Registry records and confirm that the access driveway is included in my title (SGL123456). I have attached a copy of the title plan. The ownership certificate A is correct as submitted.",
      createdAt: "20 Nov 2024 12:00",
      responseDue: "11 December 2024",
      closedAt: "28 Nov 2024 09:45",
    },
  ],

  // Description change request data
  descriptionChange: {
    proposedDescription:
      "Proposed two-storey rear extension measuring approximately 4m in depth and 6m in width to provide enlarged kitchen/dining area at ground floor level and additional bedroom with en-suite at first floor level. The extension would be constructed in London stock brick with a natural slate roof to match the existing dwelling. Existing single-storey outrigger to be demolished as part of the works.",
    changeRequest: {
      previousDescription:
        "Proposed two-storey rear extension measuring approximately 4 metres in depth and 6 metres in width to provide enlarged kitchen and dining area on the ground floor with additional bedroom and en-suite bathroom on the first floor. Materials to match existing dwelling including London stock brick and slate roof tiles.",
      proposedDescription:
        "Proposed two-storey rear extension measuring approximately 4m in depth and 6m in width to provide enlarged kitchen/dining area at ground floor level and additional bedroom with en-suite at first floor level. The extension would be constructed in London stock brick with a natural slate roof to match the existing dwelling. Existing single-storey outrigger to be demolished as part of the works.",
      createdAt: "20 November 2024",
      responseDue: "27 November 2024",
      updatedAt: "24 November 2024",
      rejectionReason:
        "I disagree with the addition of 'Existing single-storey outrigger to be demolished' as no demolition is proposed. The existing outrigger is being retained and incorporated into the new extension.",
    },
  },

  // Validation requests summary — all request types for the "Review validation requests" page
  validationRequests: [
    {
      id: 1,
      type: "additional_document",
      requestLabel: "New document",
      detail: "Materials schedule",
      state: "pending",
      createdAt: "20 Nov 2024",
    },
    {
      id: 2,
      type: "description_change",
      requestLabel: "Change description",
      detail:
        "Proposed two-storey rear extension measuring approximately 4m in depth and 6m in width to provide enlarged kitchen/dining area at ground floor level and additional bedroom with en-suite at first floor level.",
      state: "open",
      daysDue: 8,
      createdAt: "18 Nov 2024",
      notifiedAt: "18 Nov 2024",
    },
    {
      id: 3,
      type: "red_line_boundary",
      requestLabel: "Red line boundary changes",
      detail:
        "The boundary includes land belonging to the adjacent property at 14 Elm Grove. Please review and submit a corrected red line boundary.",
      state: "open",
      daysDue: -3,
      createdAt: "10 Nov 2024",
      notifiedAt: "10 Nov 2024",
    },
    {
      id: 4,
      type: "replacement_document",
      requestLabel: "Replacement document",
      detail: "Site plan (Drawing No. 001 Rev A)",
      state: "closed",
      createdAt: "15 Nov 2024",
      closedAt: "25 Nov 2024",
    },
    {
      id: 5,
      type: "other_change",
      requestLabel: "Other",
      detail:
        "The application does not include details of the proposed materials for the external walls and roof of the extension.",
      state: "closed",
      createdAt: "20 Nov 2024",
      closedAt: "28 Nov 2024",
    },
  ],

  // Validation decision data — dates and request counts for
  // the "Send validation decision" task (Task 14)
  validationDecision: {
    validFromDate: "15 November 2024", // received_at when no requests
    validFromDateAfterRequests: "2 December 2024", // next business day after last request closed
    invalidatedAt: "20 November 2024",
    validatedAt: "22 November 2024",
    invalidationResponseDue: "11 December 2024", // 15 business days after invalidatedAt
    unresolvedRequestCount: 3,
    resolvedRequestCount: 2,
  },

  // Consultation task list — section definitions for the consultation stage
  consultationTasks: {
    neighbourTasks: [
      { name: "Select and add neighbours", slug: "select-neighbours" },
      { name: "Send letters to neighbours", slug: "send-letters-to-neighbours" },
      { name: "View neighbour responses", slug: "view-neighbour-responses" },
    ],
    consulteeTasks: [
      { name: "Add and assign consultees", slug: "select-consultees" },
      { name: "Send emails to consultees", slug: "email-consultees" },
      { name: "View consultee responses", slug: "view-consultee-responses" },
    ],
    publicityTasks: [
      { name: "Site notice", slug: "site-notice" },
      { name: "Confirm site notice", slug: "confirm-site-notice" },
      { name: "Press notice", slug: "press-notice" },
      { name: "Confirm press notice", slug: "confirm-press-notice" },
    ],
  },

  cancelledValidationRequests: [
    {
      id: 6,
      type: "additional_document",
      requestLabel: "New document",
      detail: "Flood risk assessment",
      cancelReason:
        "Confirmed flood zone 1 — FRA not required for this application type.",
      cancelledAt: "22 Nov 2024",
    },
  ],

  // Neighbour responses — uploaded/received comments from neighbours about the application
  neighbourResponses: [
    {
      id: 1,
      name: "S. O'Brien",
      email: "s.obrien@example.com",
      address: "14 Elm Grove, London, SE15 5DE",
      neighbourSelected: true,
      receivedAt: "2 December 2024",
      summaryTag: "objection",
      tags: ["light", "privacy"],
      response:
        "I strongly object to this proposed two-storey rear extension. The additional height will significantly reduce the natural light reaching our rear garden and kitchen window, particularly during the winter months when the sun is low. The first-floor bedroom window will also directly overlook our private garden and patio area, which we currently enjoy without any overlooking from neighbouring properties. We have lived here for 15 years and this would fundamentally change the character of our outdoor space. I would ask the council to consider the impact on our amenity before granting permission.",
      redactedResponse:
        "I strongly object to this proposed two-storey rear extension. The additional height will significantly reduce the natural light reaching our rear garden and kitchen window, particularly during the winter months when the sun is low. The first-floor bedroom window will also directly overlook our private garden and patio area, which we currently enjoy without any overlooking from neighbouring properties. [redacted] I would ask the council to consider the impact on our amenity before granting permission.",
      redactedBy: "Sarah Johnson",
    },
    {
      id: 2,
      name: "C. Evans",
      email: "c.evans@example.com",
      address: "8 Elm Grove, London, SE15 5DE",
      neighbourSelected: true,
      receivedAt: "5 December 2024",
      summaryTag: "objection",
      tags: ["design", "noise"],
      response:
        "I object to this application. The proposed extension is out of keeping with the existing terrace of Victorian properties on Elm Grove. A two-storey extension of this depth (4 metres) would be visually dominant when viewed from rear gardens and would set a harmful precedent for similar developments along the row. I am also concerned about noise and disruption during the construction period which could last several months. My elderly mother lives with us and relies on a quiet environment for her health.",
      redactedResponse:
        "I object to this application. The proposed extension is out of keeping with the existing terrace of Victorian properties on Elm Grove. A two-storey extension of this depth (4 metres) would be visually dominant when viewed from rear gardens and would set a harmful precedent for similar developments along the row. I am also concerned about noise and disruption during the construction period which could last several months. [redacted]",
      redactedBy: "Sarah Johnson",
    },
    {
      id: 3,
      name: "K. Williams",
      email: "k.williams@example.com",
      address: "11 Elm Grove, London, SE15 5DD",
      neighbourSelected: true,
      receivedAt: "3 December 2024",
      summaryTag: "supportive",
      tags: ["design"],
      response:
        "I support this application. The proposed extension is modest in scale and the use of matching materials (London stock brick and slate) will ensure it blends well with the existing dwelling. The additional living space will benefit the family and is in keeping with similar extensions that have been approved elsewhere on the street. I have no concerns about overlooking as our property faces the front of the application site.",
      redactedResponse: null,
      redactedBy: null,
    },
    {
      id: 4,
      name: "R. Patel",
      email: "r.patel@example.com",
      address: "10 Elm Grove, London, SE15 5DE",
      neighbourSelected: true,
      receivedAt: "8 December 2024",
      summaryTag: "supportive",
      tags: [],
      response:
        "We have no objection to the proposed rear extension. We have spoken to Mr Morton about his plans and are satisfied that the extension will not affect our property. The design is sympathetic to the area and we welcome the improvement to the housing stock on our street.",
      redactedResponse: null,
      redactedBy: null,
    },
    {
      id: 5,
      name: "D. Brown",
      email: "d.brown@example.com",
      address: "10A Elm Grove, London, SE15 5DE",
      neighbourSelected: true,
      receivedAt: "6 December 2024",
      summaryTag: "neutral",
      tags: ["access"],
      response:
        "I wish to make a neutral comment. While I do not object to the principle of the extension, I would like the council to ensure that the construction access arrangements do not block the shared alleyway that runs between numbers 10 and 12. This alleyway is used by several properties for bin storage and rear garden access. Could a condition be attached to any permission to ensure access is maintained during the building works?",
      redactedResponse: null,
      redactedBy: null,
    },
    {
      id: 6,
      name: "A. Nguyen",
      email: null,
      address: "13 Elm Grove, London, SE15 5DD",
      neighbourSelected: true,
      receivedAt: "10 December 2024",
      summaryTag: "neutral",
      tags: ["traffic", "other"],
      response:
        "I am writing regarding the above application. I have no strong feelings either way about the extension itself, but I would ask that consideration be given to the parking situation during construction. Elm Grove is already heavily parked and any construction vehicles or skips will cause further congestion. I would also like to know if the applicant intends to convert the loft in future, as this would be more concerning in terms of the overall bulk of the building.",
      redactedResponse: null,
      redactedBy: null,
    },
  ],

  // Redaction guidelines HTML — from redaction_guidelines.yml
  redactionGuidelines: `<div class="govuk-body">
    <p>You need to redact any:</p>
    <ul class="govuk-list govuk-list--bullet">
      <li>personal data</li>
      <li>special category data</li>
    </ul>
    <strong>Personal data</strong>
    <p>This includes any words or phrases that could identify a particular person, such as names, addresses or descriptions.</p>
    <strong>Names</strong>
    <p>Redact the name of the person or people making the comment.</p>
    <p>The applicant's name does not usually need to be redacted. However, you may need to redact it if the nature of the application could mean that the applicant's name is linked to 'special category data'. For example, when a flat is obviously being adapted for a disabled person.</p>
    <p>Redact any other names or references to neighbours.</p>
    <strong>Third party address</strong>
    <p>Do not redact the address of the person making the comment. This may be made public by the Planning Inspectorate in the event of an appeal in order to give the comment weight.</p>
    <p>Redact any other third party addresses.</p>
    <strong>Contact information</strong>
    <p>Redact all contact information such as telephone, email or websites.</p>
    <strong>Personal details</strong>
    <p>Redact any words or phrases that could help someone to identify a person. This includes descriptions of:</p>
    <ul class="govuk-list govuk-list--bullet">
      <li>how a person looks or speaks</li>
      <li>a person's occupation</li>
      <li>a place in relation to the site, for example, 'the garden two doors down on the right'</li>
    </ul>
    <strong>Special category data</strong>
    <p>Redact any information about a person's:</p>
    <ul class="govuk-list govuk-list--bullet">
      <li>race or ethnic origin</li>
      <li>politics, religion or philosophical beliefs</li>
      <li>trade union membership</li>
      <li>health</li>
      <li>sex life or sexual orientation</li>
    </ul>
  </div>`,

  // Neighbour letter template — realistic letter text with mock data substituted
  neighbourLetterTemplate: `# Town and Country Planning Act 1990

Dear Resident

A planning application has been made for the development described below:

Site address: 12 Elm Grove, London, SE15 5DE

Proposal: Two-storey rear extension to provide enlarged kitchen/dining area and additional bedroom.

Name of applicant: James Morton

Application number: BPS-24-00345-HAPP

You can comment on this planning application until 16 December 2024. If we receive your comments after this date, we may not be able to take them into consideration if a decision has already been made.

If you are not the owner or landlord of this property, please forward this letter to the person who is.

# View, comment and track planning applications online

Use this link to:
* view the application documents
* submit your comments about the application

https://southwark.bops-applicants.services/planning_applications/BPS-24-00345-HAPP

# Commenting on this application

Tell us about anything that you think we should consider when making a decision about this application.

We can only consider comments that relate to the actual proposals. Please review the application documents before making comments.

Your comments will be published on our website. Do not include any personal details or information that you do not wish to be made public.

# If a decision is appealed

If the Council's decision is appealed and you have commented, we will write to you to let you know. Your comments will be shared with the Planning Inspectorate. You will not be able to make any further comments if the decision is appealed.

You will be notified of a decision about the appeal.

# Commenting by post

The quickest way to make a comment is by using the link in this letter.

You can make a comment by post to this address:
Planning Department, Southwark Council, 160 Tooley Street, London, SE1 2QH

Please include the application number and site address.

Yours

Sarah Johnson
Planning officer`,

  // Neighbour letter batches — sent letter history for audit/archive view
  neighbourLetterBatches: [
    {
      id: 1,
      dateSent: "25 November 2024",
      responsePeriod: 21,
      recipients: [
        "10 Elm Grove, London, SE15 5DE",
        "14 Elm Grove, London, SE15 5DE",
        "11 Elm Grove, London, SE15 5DD",
        "13 Elm Grove, London, SE15 5DD",
        "10A Elm Grove, London, SE15 5DE",
        "16 Elm Grove, London, SE15 5DE",
        "12A Elm Grove, London, SE15 5DE",
        "8 Elm Grove, London, SE15 5DE",
      ],
    },
    {
      id: 2,
      dateSent: "10 December 2024",
      responsePeriod: 21,
      recipients: [
        "10 Elm Grove, London, SE15 5DE",
        "14 Elm Grove, London, SE15 5DE",
      ],
    },
  ],

  // Default consultee email template (from en.yml consultee_emails)
  consulteeEmailTemplate: {
    subject: "Comments requested for {{reference}}",
    body: `Dear {{name}}

{{application_title_case}} number {{reference}}

We have received an {{application_short_case}} for the development described below.

## Proposal

{{description}}

## Site address

{{address}}

To view the {{application_short_case}} documents, visit:
{{link}}.

## Comment on this {{application_short_case}}

Please submit your comments by {{closing_date}} by using the web form. You can include attachments. We may not be able to consider comments received after this date.

Yours


{{local_authority}}`,
  },

  // Assessment task list — section definitions for the assessment stage
  assessmentTasks: {
    checkApplicationTasks: [
      {
        name: "Check application details and description documents",
        slug: "check-consistency",
      },
      { name: "Check publicity", slug: "check-publicity" },
      {
        name: "Check ownership certificate",
        slug: "check-ownership-certificate-assessment",
      },
      {
        name: "Check consultees consulted",
        slug: "check-consultees-consulted",
      },
      { name: "Check site history", slug: "check-site-history" },
      {
        name: "Permitted development rights",
        slug: "permitted-development-rights",
      },
    ],
    assessmentSummariesTasks: [
      { name: "Site description", slug: "site-description" },
      { name: "Summary of works", slug: "summary-of-works" },
      { name: "Site visits", slug: "site-visits" },
    ],
    policiesTasks: [
      { name: "Considerations", slug: "considerations" },
    ],
    legislationTasks: [
      {
        name: "Development type classification",
        slug: "development-type",
      },
      {
        name: "Part 1, Class A — Enlargement of a dwellinghouse",
        slug: "policy-class-1a",
      },
      {
        name: "Part 1, Class B — Additions to the roof",
        slug: "policy-class-1b",
      },
    ],
    completeAssessmentTasks: [
      {
        name: "Review assessment documents",
        slug: "review-assessment-documents",
      },
      {
        name: "Make draft recommendation",
        slug: "make-draft-recommendation",
      },
      { name: "Standard conditions", slug: "standard-conditions" },
      {
        name: "Pre-commencement conditions",
        slug: "pre-commencement-conditions",
      },
      { name: "Informatives", slug: "informatives" },
      {
        name: "Review and submit recommendation",
        slug: "submit-recommendation",
      },
    ],
  },
};
