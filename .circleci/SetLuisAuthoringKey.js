const authoringKeys =
[
  process.env.LUIS_AUTHORING_KEY_ALT_1,
  process.env.LUIS_AUTHORING_KEY_ALT_2,
  process.env.LUIS_AUTHORING_KEY_ALT_3,
  process.env.LUIS_AUTHORING_KEY_ALT_4,
  process.env.LUIS_AUTHORING_KEY_ALT_5,
]

let buildNumber = +process.env.CIRCLE_BUILD_NUM

// We have 5 LUIS Authoring Keys that we rotate through.
// We use the Circle CI Build Number to help us get an index to each in sequence.
// A Build + Test Run is 2 Workflows, each having its own Build Number.
// The Build part does NOT consume a LUIS Authoring Keys, which affects our algorithm,
// thus we need to use one LUIS Authoring Key for every other Build Number.
//
// While this is not perfect, it does work.
let authoringKeyIndex = Math.floor((buildNumber % 10) / 2)

let luisAuthoringKey = authoringKeys[authoringKeyIndex]

console.log(`export LUIS_AUTHORING_KEY=${luisAuthoringKey}\n`)
console.log(`export CYPRESS_BUILD_NUM=${buildNumber}\n`)

