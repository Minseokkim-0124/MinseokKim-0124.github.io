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
        {" "}
        My work spans <strong>3D perception and data-efficient learning</strong>, including LiDAR/Radar perception, open-world category discovery, and
        vision–language dataset distillation. Through these topics, I have explored how models can recognize unfamiliar categories and learn useful
        representations from limited data.{" "}
      </p>{" "}
      <p>
        {" "}
        More recently, my research has focused on <strong>egocentric understanding and prediction</strong>, <strong>audio-visual generation</strong>,
        and <strong>spatial audio</strong>. I’m interested in understanding activities and human motion from sparse wearable signals, as well as
        generating and controlling sound grounded in visual content. I also explore retrieval and lightweight adaptation as ways to extend pretrained
        models.{" "}
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
