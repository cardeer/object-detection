import { ActionTree } from "vuex";
import { State } from "./state";
import Types from "./types";

const actions: ActionTree<State, unknown> = {
  [Types.SET_FILTER]({ commit }, payload) {
    commit(Types.SET_FILTER, payload);
  },
  [Types.UPDATE_FILTER]({ commit }, payload) {
    commit(Types.UPDATE_FILTER, payload);
  },
  [Types.SET_PARENTS]({ commit }, payload) {
    commit(Types.SET_PARENTS, payload);
  },
  [Types.SET_DETECTED_OBJECTS]({ commit }, payload) {
    commit(Types.SET_DETECTED_OBJECTS, payload);
  },
  [Types.SET_CAPTURE]({ commit }, payload) {
    commit(Types.SET_CAPTURE, payload);
  },
};

export default actions;
