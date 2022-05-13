import { MutationTree } from "vuex";
import { State } from "./state";
import Types from "./types";

const mutations: MutationTree<State> = {
  [Types.SET_FILTER](state, payload) {
    state.filter = payload;
  },
  [Types.UPDATE_FILTER](state, payload) {
    if (payload.value) {
      state.filter[payload.label] = payload.value;
    } else {
      delete state.filter[payload.label];
    }
  },
  [Types.SET_PARENTS](state, payload) {
    state.parents = payload;
  },
  [Types.SET_DETECTED_OBJECTS](state, payload) {
    state.detectedObjects = payload;
  },
  [Types.SET_CAPTURE](state, payload) {
    state.captured = payload;
  },
};

export default mutations;
