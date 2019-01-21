﻿{
  "trainDialogs": [
    {
      "trainDialogId": "54d9525b-2600-45a0-8ce8-19a5a6fa55bc",
      "rounds": [
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "My name is David.",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 11,
                    "endCharIndex": 15,
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
                  "blisTime": 0.006269216537475586,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "My name is Susan.",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 11,
                    "endCharIndex": 15,
                    "entityText": "Susan"
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
                        "userText": "Susan",
                        "displayText": "Susan",
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
                  "blisTime": 0.005974769592285156,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "WHat",
                "labelEntities": []
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
                        "userText": "Susan",
                        "displayText": "Susan",
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
                  "blisTime": 0.01285099983215332,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "But I am Joe",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 9,
                    "endCharIndex": 11,
                    "entityText": "Joe",
                    "resolution": {},
                    "builtinType": "LUIS"
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
                        "userText": "Joe",
                        "displayText": "Joe",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.007169008255004883,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "And here is Sam",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 12,
                    "endCharIndex": 14,
                    "entityText": "Sam",
                    "resolution": {},
                    "builtinType": "LUIS"
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
                        "userText": "Sam",
                        "displayText": "Sam",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.011132240295410156,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "Lisa is here too!",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 0,
                    "endCharIndex": 3,
                    "entityText": "Lisa",
                    "resolution": {},
                    "builtinType": "LUIS"
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
                        "userText": "Lisa",
                        "displayText": "Lisa",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.007402896881103516,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "Paul is not here",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 0,
                    "endCharIndex": 3,
                    "entityText": "Paul",
                    "resolution": {},
                    "builtinType": "LUIS"
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
                        "userText": "Paul",
                        "displayText": "Paul",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.01172637939453125,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "sdfsdf",
                "labelEntities": []
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
                        "userText": "Paul",
                        "displayText": "Paul",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.010939836502075195,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "rtertretreter",
                "labelEntities": []
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
                        "userText": "Paul",
                        "displayText": "Paul",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.011391401290893554,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "xyz123",
                "labelEntities": []
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
                        "userText": "Paul",
                        "displayText": "Paul",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.010894060134887695,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "xxxxx",
                "labelEntities": []
              }
            ]
          },
          "scorerSteps": []
        }
      ],
      "initialFilledEntities": [],
      "createdDateTime": "2019-01-11T22:58:01.0090548+00:00",
      "lastModifiedDateTime": "2019-01-11T22:58:01+00:00"
    },
    {
      "trainDialogId": "c9e63190-66f8-48f2-9900-5814f2462dd9",
      "rounds": [
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "My name is David.",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 11,
                    "endCharIndex": 15,
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
                  "blisTime": 0.006269216537475586,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "My name is Susan.",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 11,
                    "endCharIndex": 15,
                    "entityText": "Susan"
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
                        "userText": "Susan",
                        "displayText": "Susan",
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
                  "blisTime": 0.005974769592285156,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "WHat",
                "labelEntities": []
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
                        "userText": "Susan",
                        "displayText": "Susan",
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
                  "blisTime": 0.01285099983215332,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "But I am Joe",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 9,
                    "endCharIndex": 11,
                    "entityText": "Joe",
                    "resolution": {},
                    "builtinType": "LUIS"
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
                        "userText": "Joe",
                        "displayText": "Joe",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.007169008255004883,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "And here is Sam",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 12,
                    "endCharIndex": 14,
                    "entityText": "Sam",
                    "resolution": {},
                    "builtinType": "LUIS"
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
                        "userText": "Sam",
                        "displayText": "Sam",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.011132240295410156,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "Lisa is here too!",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 0,
                    "endCharIndex": 3,
                    "entityText": "Lisa",
                    "resolution": {},
                    "builtinType": "LUIS"
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
                        "userText": "Lisa",
                        "displayText": "Lisa",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.007402896881103516,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "Paul is not here",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 0,
                    "endCharIndex": 3,
                    "entityText": "Paul",
                    "resolution": {},
                    "builtinType": "LUIS"
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
                        "userText": "Paul",
                        "displayText": "Paul",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.01172637939453125,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "sdfsdf",
                "labelEntities": []
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
                        "userText": "Paul",
                        "displayText": "Paul",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.010939836502075195,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "rtertretreter",
                "labelEntities": []
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
                        "userText": "Paul",
                        "displayText": "Paul",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.011391401290893554,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "xyz123",
                "labelEntities": []
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
                        "userText": "Paul",
                        "displayText": "Paul",
                        "builtinType": "LUIS",
                        "resolution": {}
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
                  "blisTime": 0.010894060134887695,
                  "contextDialogBlisTime": 0
                }
              }
            }
          ]
        }
      ],
      "initialFilledEntities": [],
      "createdDateTime": "2019-01-11T22:58:01.0090548+00:00",
      "lastModifiedDateTime": "2019-01-11T22:58:01+00:00"
    },
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
              }
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
              }
            }
          ]
        }
      ],
      "initialFilledEntities": [],
      "createdDateTime": "2019-01-11T22:58:01.0090548+00:00",
      "lastModifiedDateTime": "2019-01-11T22:58:01+00:00"
    },
    {
      "trainDialogId": "71dbaadd-dc5e-4baf-a490-b6fa58362bb6",
      "sourceLogDialogId": "fd009197-0b54-48fc-a5f6-d4b6aa1f522c",
      "rounds": [
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "Hi",
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
              }
            }
          ]
        },
        {
          "extractorStep": {
            "textVariations": [
              {
                "text": "Michael, what's your name?",
                "labelEntities": [
                  {
                    "entityId": "42bced67-10de-45b1-856c-3df25fd6a575",
                    "startCharIndex": 0,
                    "endCharIndex": 6,
                    "entityText": "Michael",
                    "resolution": {},
                    "builtinType": "LUIS"
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
                        "userText": "Michael",
                        "displayText": "Michael",
                        "builtinType": "LUIS",
                        "resolution": {}
                      }
                    ]
                  }
                ],
                "context": {},
                "maskedActions": []
              },
              "labelAction": "40237225-6b32-48b4-9cb2-0814a87266e9",
              "metrics": {
                "predictMetrics": null
              }
            }
          ]
        }
      ],
      "initialFilledEntities": [],
      "createdDateTime": "2019-01-11T22:58:01.0090548+00:00",
      "lastModifiedDateTime": "2019-01-11T22:58:01+00:00"
    }
  ],
  "actions": [
    {
      "actionId": "1d49504d-0d54-409c-be9a-163888520bfd",
      "createdDateTime": "2019-01-11T22:58:01.0090548+00:00",
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
      "createdDateTime": "2019-01-11T22:58:01.0090548+00:00",
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
      "createdDateTime": "2019-01-11T22:58:01.0090548+00:00",
      "entityName": "name",
      "entityType": "LUIS",
      "isMultivalue": false,
      "isNegatible": false,
      "resolverType": "none"
    }
  ],
  "packageId": "f84bd0a5-97af-4da0-ae30-016910cff91d"
}