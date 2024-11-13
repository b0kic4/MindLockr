import { create } from "zustand";

type State = {
  pgpmsg: string;
  pgpkey: string;
};

type Actions = {
  setSelectedMsg: (pathOrValue: string) => void;
  setSelectedKey: (pathOrValue: string) => void;
};

const useCipherPgpData = create<State & Actions>((set) => ({
  pgpmsg: ``,
  pgpkey: ``,
  setSelectedMsg: (pathOrValue) => set({ pgpmsg: pathOrValue }),
  setSelectedKey: (pathOrValue) => set({ pgpkey: pathOrValue }),
}));

export default useCipherPgpData;
