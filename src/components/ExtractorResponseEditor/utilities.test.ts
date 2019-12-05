/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as utilities from './utilities'
import * as models from './models'
import Plain from 'slate-plain-serializer'

describe('ExtractResponseEditor', () => {
    describe('utilities', () => {
        describe('tokenizeText', () => {
            test('given empty string return empty array', () => {
                expect(utilities.tokenizeText('', /\s+/g)).toEqual([])
            })

            test('given string with tokens return array of token data', () => {
                // Arrange
                const input = 'this is a test'
                const regex = /\s+/g

                // Act
                const tokens = utilities.tokenizeText(input, regex)

                expect(Array.isArray(tokens)).toBeTruthy()
                expect(tokens.length).toBe(7)
                expect(tokens.filter(t => t.isSelectable).length).toBe(4)
            })
        })

        describe('findLastIndex', () => {
            test('given empty array return -1', () => {
                expect(utilities.findLastIndex([], () => true)).toBe(-1)
            })

            test('given non-empty array and predicate that always returns false, return -1', () => {
                expect(utilities.findLastIndex([1, 2, 3, 4], () => false)).toBe(-1)
            })

            test('given non-empty array and predicate that matches single item return that items index', () => {
                expect(utilities.findLastIndex([1, 2, 3, 4], x => x === 2)).toBe(1)
            })

            test('given non-empty array and predicate that matches multiple items, return the last/largest index', () => {
                expect(utilities.findLastIndex([1, 2, 3, 4], x => x > 2)).toBe(3)
            })
        })

        describe('addTokenIndicesToCustomEntities', () => {
            const tokens: utilities.IToken[] = [
                {
                    text: 'a',
                    isSelectable: true,
                    startIndex: 0,
                    endIndex: 1
                },
                {
                    text: ' ',
                    isSelectable: false,
                    startIndex: 1,
                    endIndex: 2
                },
                {
                    text: 'b',
                    isSelectable: true,
                    startIndex: 2,
                    endIndex: 3
                },
                {
                    text: ' ',
                    isSelectable: false,
                    startIndex: 3,
                    endIndex: 4
                },
                {
                    text: 'c',
                    isSelectable: true,
                    startIndex: 4,
                    endIndex: 5
                }
            ]

            test('given empty entities array return empty array', () => {
                expect(utilities.addTokenIndicesToCustomEntities(tokens, [])).toEqual([])
            })

            test('given entity array return new entity array with correct token indices', () => {
                // Arrange
                const customEntities: models.IGenericEntity<any>[] = [
                    {
                        data: {},
                        startIndex: 0,
                        endIndex: 1
                    }
                ]

                // Act
                const customEntitiesWithTokenIndex = utilities.addTokenIndicesToCustomEntities(tokens, customEntities)

                // Assert
                const first = customEntitiesWithTokenIndex[0]
                expect(first.startTokenIndex).toBe(0)
                expect(first.endTokenIndex).toBe(1)
            })
        })

        describe('wrapTokensWithEntities', () => {
            test('given tokens and empty entity array return tokens', () => {
                const tokens: utilities.IToken[] = []
                expect(utilities.wrapTokensWithEntities(tokens, [])).toBe(tokens)
            })

            test('given tokens and entity array return new array with entities wrapping tokens', () => {
                // Arrange
                const tokens: utilities.IToken[] = [
                    {
                        text: 'a',
                        isSelectable: true,
                        startIndex: 0,
                        endIndex: 1
                    },
                    {
                        text: ' ',
                        isSelectable: false,
                        startIndex: 1,
                        endIndex: 2
                    },
                    {
                        text: 'b',
                        isSelectable: true,
                        startIndex: 2,
                        endIndex: 3
                    }
                ]

                const customEntities: models.IGenericEntity<any>[] = [
                    {
                        data: {},
                        startIndex: 2,
                        endIndex: 3
                    },
                    {
                        data: {},
                        startIndex: 0,
                        endIndex: 1
                    }
                ]

                const customEntitiesWithTokenIndex = utilities.addTokenIndicesToCustomEntities(tokens, customEntities)
                const expectedTokenArray: utilities.TokenArray = [
                    {
                        entity: customEntitiesWithTokenIndex[1],
                        tokens: [tokens[0]]
                    },
                    {
                        text: ' ',
                        isSelectable: false,
                        startIndex: 1,
                        endIndex: 2
                    },
                    {
                        entity: customEntitiesWithTokenIndex[0],
                        tokens: [tokens[2]]
                    }
                ]

                // Act
                const tokenArray = utilities.wrapTokensWithEntities(tokens, customEntitiesWithTokenIndex)

                // Assert
                expect(tokenArray).toEqual(expectedTokenArray)
            })
        })

        describe('convertToSlateNodes', () => {
            test('given empty tokens array return single empty text node', () => {
                const expectedNodes = [
                    {
                        "kind": "text",
                        "leaves": [
                            {
                                "kind": "leaf",
                                "text": '',
                                "marks": [] as any[]
                            }
                        ]
                    }
                ]

                expect(utilities.convertToSlateNodes([])).toEqual(expectedNodes)
            })

            test('given tokens array WITHOUT entities return inline nodes for selectable tokens and text nodes for non selectable', () => {
                const tokens: utilities.TokenArray = [
                    {
                        text: 'a',
                        isSelectable: true,
                        startIndex: 0,
                        endIndex: 1
                    },
                    {
                        text: ' ',
                        isSelectable: false,
                        startIndex: 1,
                        endIndex: 2
                    },
                    {
                        text: 'b',
                        isSelectable: true,
                        startIndex: 2,
                        endIndex: 3
                    }
                ]

                const expectedNodes = [
                    {
                        "kind": "inline",
                        "type": models.NodeType.TokenNodeType,
                        "isVoid": false,
                        "data": tokens[0],
                        "nodes": [
                            {
                                "kind": "text",
                                "leaves": [
                                    {
                                        "kind": "leaf",
                                        "text": (tokens[0] as any).text,
                                        "marks": [] as any[]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "kind": "text",
                        "leaves": [
                            {
                                "kind": "leaf",
                                "text": (tokens[1] as any).text,
                                "marks": [] as any[]
                            }
                        ]
                    },
                    {
                        "kind": "inline",
                        "type": models.NodeType.TokenNodeType,
                        "isVoid": false,
                        "data": tokens[2],
                        "nodes": [
                            {
                                "kind": "text",
                                "leaves": [
                                    {
                                        "kind": "leaf",
                                        "text": (tokens[2] as any).text,
                                        "marks": []
                                    }
                                ]
                            }
                        ]
                    }
                ]

                expect(utilities.convertToSlateNodes(tokens)).toEqual(expectedNodes)
            })

            test('given tokens array WITH entities show entities as custom entity nodes', () => {
                const tokens: utilities.TokenArray = [
                    {
                        entity: {
                            data: {},
                            startIndex: 0,
                            endIndex: 1
                        },
                        tokens: [
                            {
                                text: 'a',
                                isSelectable: true,
                                startIndex: 0,
                                endIndex: 1
                            }
                        ]
                    },
                    {
                        text: ' ',
                        isSelectable: false,
                        startIndex: 1,
                        endIndex: 2
                    },
                    {
                        text: 'b',
                        isSelectable: true,
                        startIndex: 2,
                        endIndex: 3
                    }
                ]

                const expectedNodes = [
                    {
                        "kind": "inline",
                        "type": models.NodeType.CustomEntityNodeType,
                        "isVoid": false,
                        "data": (tokens[0] as any).entity.data,
                        "nodes": [
                            {
                                "kind": "inline",
                                "type": models.NodeType.TokenNodeType,
                                "isVoid": false,
                                "data": (tokens[0] as any).tokens[0],
                                "nodes": [
                                    {
                                        "kind": "text",
                                        "leaves": [
                                            {
                                                "kind": "leaf",
                                                "text": (tokens[0] as any).tokens[0].text,
                                                "marks": [] as any[]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "kind": "text",
                        "leaves": [
                            {
                                "kind": "leaf",
                                "text": (tokens[1] as any).text,
                                "marks": [] as any[]
                            }
                        ]
                    },
                    {
                        "kind": "inline",
                        "type": models.NodeType.TokenNodeType,
                        "isVoid": false,
                        "data": tokens[2],
                        "nodes": [
                            {
                                "kind": "text",
                                "leaves": [
                                    {
                                        "kind": "leaf",
                                        "text": (tokens[2] as any).text,
                                        "marks": [] as any[]
                                    }
                                ]
                            }
                        ]
                    }
                ]

                expect(utilities.convertToSlateNodes(tokens)).toEqual(expectedNodes)
            })
        })

        describe('getEntitiesFromValueUsingTokenData', () => {
            test('given slate value with entity that does not have character index data, extract it with index data by using tokens within it', () => {
                // Arrange
                const tokens: utilities.TokenArray = [
                    {
                        text: 'a',
                        isSelectable: true,
                        startIndex: 0,
                        endIndex: 1
                    },
                    {
                        text: ' ',
                        isSelectable: false,
                        startIndex: 1,
                        endIndex: 2
                    },
                    {
                        entity: {
                            data: {
                                text: 'a'
                            },
                            startIndex: 1,
                            endIndex: 2
                        },
                        tokens: [
                            {
                                text: 'a',
                                isSelectable: true,
                                startIndex: 1,
                                endIndex: 2
                            }
                        ]
                    },
                ]

                const slateValue = utilities.convertToSlateValue(tokens)
                const expectedString = 'a a'
                const expectedEntities: models.IGenericEntity<any>[] = [
                    {
                        data: {
                            text: 'a'
                        },
                        startIndex: 1,
                        endIndex: 2,
                    }
                ]

                // Act
                const actualEntities = utilities.getEntitiesFromValueUsingTokenData(slateValue.change())

                // Assert
                expect(Plain.serialize(slateValue)).toEqual(expectedString)
                expect(actualEntities).toEqual(expectedEntities)
            })

        })

        describe('warnAboutOverlappingEntities', () => {
            test('given no entities return false', () => {
                expect(utilities.warnAboutOverlappingEntities([])).toBe(false)
            })

            test('given entities NOT overlapping return false', () => {
                const customEntities: models.IGenericEntity<any>[] = [
                    {
                        startIndex: 1,
                        endIndex: 3,
                        data: {},
                    },
                    {
                        startIndex: 5,
                        endIndex: 7,
                        data: {},
                    }
                ]

                expect(utilities.warnAboutOverlappingEntities(customEntities)).toBe(false)
            })

            test('given entities WITH overlap return true', () => {
                const customEntities: models.IGenericEntity<any>[] = [
                    {
                        startIndex: 1,
                        endIndex: 3,
                        data: {},
                    },
                    {
                        startIndex: 0,
                        endIndex: 4,
                        data: {},
                    },
                ]

                expect(utilities.warnAboutOverlappingEntities(customEntities)).toBe(true)
            })
        })

        describe('discardOverlappingEntities', () => {
            test('given empty array return empty array', () => {
                expect(utilities.discardOverlappingEntities([])).toEqual([])
            })

            test('given entities NOT overlapping, dont discard any, ensure length is same', () => {
                const customEntities: models.IGenericEntity<any>[] = [
                    {
                        startIndex: 1,
                        endIndex: 3,
                        data: {},
                    },
                    {
                        startIndex: 5,
                        endIndex: 7,
                        data: {},
                    }
                ]

                expect(utilities.discardOverlappingEntities(customEntities).length).toBe(2)
            })

            test('given entities WITH overlap, discard', () => {
                const customEntities: models.IGenericEntity<any>[] = [
                    {
                        startIndex: 1,
                        endIndex: 3,
                        data: {},
                    },
                    {
                        startIndex: 0,
                        endIndex: 4,
                        data: {},
                    },
                ]

                expect(utilities.discardOverlappingEntities(customEntities).length).toBe(1)
            })
        })
    })
})