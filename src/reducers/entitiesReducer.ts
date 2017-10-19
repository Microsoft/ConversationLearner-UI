import { ActionObject } from '../types'
import { EntityState } from '../types'
import { AT } from '../types/ActionTypes'
import { EntityBase } from 'blis-models';
import { Reducer } from 'redux'

const initialState: EntityState = [];

const entitiesReducer: Reducer<EntityState> = (state = initialState, action: ActionObject): EntityState => {
    switch (action.type) {
        case AT.LOGOUT:
            return [ ...initialState ]
        case AT.FETCH_ENTITIES_FULFILLED:
            return action.allEntities;
        case AT.CREATE_BLIS_APPLICATION_FULFILLED:
            return []
        case AT.CREATE_ENTITY_FULFILLED:
            let newEntity = { ...action.entity, entityId: action.entityId };
            return [...state, newEntity];
        case AT.CREATE_ENTITY_FULFILLEDNEGATIVE:
            let entities: EntityBase[] = [action.positiveEntity, action.negativeEntity];
            return [...state, ...entities]
        case AT.DELETE_ENTITY_FULFILLED:
        case AT.DELETE_REVERSE_ENTITY_ASYNC:
            return state.filter(ent => ent.entityId !== action.deletedEntityId);
        case AT.EDIT_ENTITY_FULFILLED:
            let index: number = 0;
            for (let i = 0; i < state.length; i++) {
                if (state[i].entityId == action.entity.entityId) {
                    index = i
                }
            }
            let newState = Object.assign([], state);
            newState[index] = action.entity;
            return newState;
        default:
            return state;
    }
}
export default entitiesReducer;