export type Flashcard = { id: number; front: string; back: string };

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
};

export const flashcards: Flashcard[] = [
  { id: 1, front: "What is photosynthesis?", back: "The process plants use to convert light energy into chemical energy stored as glucose." },
  { id: 2, front: "Define mitochondria", back: "Organelles that generate most of the cell's ATP through respiration." },
  { id: 3, front: "What is osmosis?", back: "Movement of water across a semipermeable membrane toward higher solute concentration." },
  { id: 4, front: "State Newton's 2nd law", back: "Force equals mass times acceleration (F = ma)." },
  { id: 5, front: "What is an isotope?", back: "Atoms of the same element with different numbers of neutrons." },
  { id: 6, front: "Define entropy", back: "A measure of disorder or the number of microstates in a system." },
  { id: 7, front: "What is DNA replication?", back: "The semi-conservative process of copying DNA before cell division." },
  { id: 8, front: "What is a catalyst?", back: "A substance that speeds a reaction by lowering activation energy, unconsumed." },
  { id: 9, front: "Define kinetic energy", back: "Energy of motion, equal to ½mv²." },
  { id: 10, front: "What is homeostasis?", back: "The maintenance of a stable internal environment despite external change." },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which organelle produces most of the cell's ATP?",
    options: ["Ribosome", "Mitochondria", "Golgi apparatus", "Nucleus"],
    answerIndex: 1,
  },
  {
    id: 2,
    question: "Photosynthesis primarily converts light energy into what?",
    options: ["Heat", "Sound", "Chemical energy", "Nuclear energy"],
    answerIndex: 2,
  },
  {
    id: 3,
    question: "Newton's second law is best written as:",
    options: ["E = mc²", "F = ma", "PV = nRT", "v = d/t"],
    answerIndex: 1,
  },
  {
    id: 4,
    question: "Isotopes of an element differ in the number of:",
    options: ["Protons", "Electrons", "Neutrons", "Photons"],
    answerIndex: 2,
  },
  {
    id: 5,
    question: "A catalyst works by:",
    options: [
      "Raising activation energy",
      "Lowering activation energy",
      "Adding heat to the system",
      "Being consumed in the reaction",
    ],
    answerIndex: 1,
  },
];
