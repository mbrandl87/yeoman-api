import type { DistinctQuestion, Answers as InquirerAnswers } from 'inquirer';
import type { Logger } from './logger.js';

/**
 * Represents an answer-hash.
 */
export type PromptAnswers = InquirerAnswers;

export type PromptQuestion<A extends PromptAnswers = PromptAnswers> = DistinctQuestion<A>;

/**
 * Provides a set of questions.
 */
export type PromptQuestions<A extends PromptAnswers = PromptAnswers> = PromptQuestion<A> | Array<PromptQuestion<A>>; // | Observable<Question<A>>;

/**
 * Abstraction layer that defines the I/O interactions.
 *
 * It provides a CLI interaction
 */
export type InputOutputAdapter = {
  /**
   * A component for logging messages.
   */
  log: Logger;

  /**
   * Prompts the user for one or more questions.
   *
   * @param questions The questions to prompt.
   * @param initialAnswers Initial answers.
   */
  prompt<A extends PromptAnswers = PromptAnswers>(questions: PromptQuestions<A>, initialAnswers?: Partial<A>): Promise<A>;

  /**
   * Close underline inputs.
   */
  close(): void;

  /**
   * Shows a color-based diff of two strings.
   *
   * @param actual The actual text.
   * @param expected The expected text.
   * @param changes The changes returned by `diff`.
   * @returns The formatted message.
   */
  diff(actual: string, expected: string, changes: unknown[]): string;
};