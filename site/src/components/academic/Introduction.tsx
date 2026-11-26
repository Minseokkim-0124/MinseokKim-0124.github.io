import { Column } from "@once-ui-system/core";
export function Introduction() {
  return (
    <Column gap="16" textVariant="body-default-l" className="introduction">
      <p>
        {" "}
        I’m a Ph.D. candidate in Mechanical Engineering at <a href="https://vi.kaist.ac.kr/">VILAB, KAIST</a>, advised by{" "}
        <a href="https://vi.kaist.ac.kr/members/kuk-jin-yoon/">Prof. Kuk-Jin Yoon</a>. As a computer vision researcher, I study how AI can perceive 3D
        environments, understand human behaviour, and connect information across different modalities.{" "}
      </p>{" "}
      <p>
        My work on <strong>3D perception and data-efficient learning</strong> spans LiDAR and radar sensing, open-world category discovery, and
        vision–language dataset distillation. I now study how to recognize activities and predict human motion from sparse wearable signals, and how
        to generate <strong>spatial audio from video</strong>.
      </p>{" "}
      <p>
        {" "}
        I’m also interested in <strong>vision–language models (VLMs) and VLM diagnosis</strong>: understanding what pretrained models represent, where
        their reasoning succeeds or fails, and whether local visual decisions form a coherent global understanding.{" "}
      </p>{" "}
      <p>
        {" "}
        My broader goal is to develop efficient, controllable <strong>multimodal AI</strong> that can be applied to{" "}
        <strong>AR/VR and wearable devices</strong>. I’m particularly interested in connecting 3D understanding with human-centred perception and
        generation to support useful, immersive experiences.{" "}
      </p>
    </Column>
  );
}
