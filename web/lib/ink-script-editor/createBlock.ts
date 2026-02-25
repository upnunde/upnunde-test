import type { ScriptBlock } from "../../types/editor";

const emptyAttributes: ScriptBlock["attributes"] = {
  characterId: null,
  backgroundId: null,
  bgmId: null,
  soundId: null,
  directionId: null,
};

export function createBlock(
  type: ScriptBlock["type"],
  overrides: Partial<Omit<ScriptBlock, "attributes">> & {
    attributes?: Partial<ScriptBlock["attributes"]>;
  } = {}
): ScriptBlock {
  const id = overrides.id ?? `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return {
    id,
    type,
    content: overrides.content ?? "",
    attributes: { ...emptyAttributes, ...overrides.attributes },
    choices: overrides.choices,
    ...overrides,
  };
}
