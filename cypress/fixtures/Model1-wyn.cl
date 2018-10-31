﻿{
  "trainDialogs": [
    {
      "trainDialogId": "f8b55ecc-e57b-470c-bd11-e62251789220",
      "rounds": [
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "Hello",
                "labelEntities": []
              }
            ]
          },
          "scorerSteps": [
            {
              "input": {
                "filledEntities": [],
                "context": {},
                "maskedActions": []
              },
              "labelAction": "1d49504d-0d54-409c-be9a-163888520bfd",
              "metrics": {
                "predictMetrics": null
              },
              "logicResult": null
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "David",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 0,
                    "endCharIndex": 4,
                    "entityText": "David"
                  }
                ]
              }
            ]
          },
          "scorerSteps": [
            {
              "input": {
                "filledEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "values": [
                      {
                        "userText": "David",
                        "displayText": "David",
                        "builtinType": null,
                        "resolution": null
                      }
                    ]
                  }
                ],
                "context": {},
                "maskedActions": []
              },
              "labelAction": "40237225-6b32-48b4-9cb2-0814a87266e9",
              "metrics": {
                "predictMetrics": {
                  "blisTime": 0.005495548248291016,
                  "contextDialogBlisTime": 0
                }
              },
              "logicResult": null
            }
          ]
        }
      ],
      "initialFilledEntities": [],
      "createdDateTime": "2018-10-10T16:19:04.5085169+00:00",
      "lastModifiedDateTime": "2018-10-10T16:19:18+00:00"
    }
  ],
  "actions": [
    {
      "actionId": "1d49504d-0d54-409c-be9a-163888520bfd",
      "createdDateTime": "2018-10-09T22:05:19.2545227+00:00",
      "actionType": "TEXT",
      "payload": "{\"json\":{\"kind\":\"value\",\"document\":{\"kind\":\"document\",\"data\":{},\"nodes\":[{\"kind\":\"block\",\"type\":\"line\",\"isVoid\":false,\"data\":{},\"nodes\":[{\"kind\":\"text\",\"leaves\":[{\"kind\":\"leaf\",\"text\":\"What's your name?\",\"marks\":[]}]}]}]}}}",
      "isTerminal": true,
      "requiredEntitiesFromPayload": [],
      "requiredEntities": [],
      "negativeEntities": [
        "42bced67-10de-45b1-856c-3df25fd6a575"
      ],
      "suggestedEntity": "42bced67-10de-45b1-856c-3df25fd6a575"
    },
    {
      "actionId": "40237225-6b32-48b4-9cb2-0814a87266e9",
      "createdDateTime": "2018-10-09T22:05:24.9440827+00:00",
      "actionType": "TEXT",
      "payload": "{\"json\":{\"kind\":\"value\",\"document\":{\"kind\":\"document\",\"data\":{},\"nodes\":[{\"kind\":\"block\",\"type\":\"line\",\"isVoid\":false,\"data\":{},\"nodes\":[{\"kind\":\"text\",\"leaves\":[{\"kind\":\"leaf\",\"text\":\"Hello \",\"marks\":[]}]},{\"kind\":\"inline\",\"type\":\"mention-inline-node\",\"isVoid\":false,\"data\":{\"completed\":true,\"option\":{\"id\":\"42bced67-10de-45b1-856c-3df25fd6a575\",\"name\":\"name\"}},\"nodes\":[{\"kind\":\"text\",\"leaves\":[{\"kind\":\"leaf\",\"text\":\"$name\",\"marks\":[]}]}]},{\"kind\":\"text\",\"leaves\":[{\"kind\":\"leaf\",\"text\":\"\",\"marks\":[]}]}]}]}}}",
      "isTerminal": true,
      "requiredEntitiesFromPayload": [
        "42bced67-10de-45b1-856c-3df25fd6a575"
      ],
      "requiredEntities": [
        "42bced67-10de-45b1-856c-3df25fd6a575"
      ],
      "negativeEntities": []
    }
  ],
  "entities": [
    {
      "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
      "createdDateTime": "2018-10-09T22:05:11.6217189+00:00",
      "entityName": "name",
      "entityType": "LUIS",
      "isMultivalue": false,
      "isNegatible": false
    }
  ],
  "packageId": "65ea42d7-4aa9-4208-bb45-481a00de775a"
}