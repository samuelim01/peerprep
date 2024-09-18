import fs from 'fs/promises';
import { IQuestion } from '../models/questionModel';

export async function getDemoQuestions(): Promise<IQuestion[]> {
    const data = await fs.readFile('./src/data/questions.json', { encoding: 'utf8' });
    return JSON.parse(data);
}
