import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Question {
  id: number;
  text: string;
  applies: boolean;
  rating: number;
}

@Component({
  selector: 'app-supplier-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-evaluation.component.html',
  styleUrls: ['./supplier-evaluation.component.scss']
})
export class SupplierEvaluationComponent implements OnInit {
  // Provider Information
  providerName: string = '';
  providerNit: string = '';
  providerType: string = '';
  providerCategory: string = '';
  providerPredecessor: string = '';
  selectedOption: string = '';
  errorMessage: string = '';

  // Evaluation Details
  options: string[] = ['Opcion 1', 'Opcion 2', 'Opcion 3', 'Opcion 4'];
  evaluationCriteria: string = 'Criterios de Evaluación';
   
  // Questions and Stars
  questions: Question[] = [];
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(private route: ActivatedRoute) {
    this.initializeQuestions();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.providerName = params['name'] || '';
      this.providerNit = params['nit'] || '';
      this.providerType = params['type'] || '';
      this.providerCategory = params['category'] || '';
      this.providerPredecessor = params['predecessor'] || '';
    });
  }

  // Getters for counts
  get responseCount(): number {
    return this.questions.filter(q => q.applies && q.rating > 0).length;
  }

  get totalQuestions(): number {
    return this.questions.filter(q => q.applies).length;
  }

  private initializeQuestions(): void {
    this.questions = [
      { id: 1, text: 'Question 1', applies: true, rating: 0 },
      { id: 2, text: 'Question 2', applies: true, rating: 0 },
      { id: 3, text: 'Question 3', applies: true, rating: 0 },
      { id: 34, text: 'Question 4', applies: true, rating: 0 },
    ];
  }

  onAppliesChange(event: Event, question: Question): void {
    const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
    question.applies = inputElement.checked; // Get the 'checked' property as a boolean
    if (!question.applies) {
      question.rating = 0;
    }
  }
  
  
  
  
  rate(question: Question, rating: number): void {
    if (question.applies) {
      question.rating = rating;
    }
  }
  
  isStarActive(question: Question, star: number): boolean {
    return question.applies && question.rating >= star;
  }

  saveEvaluation(): void {
    if (this.validateEvaluation()) {
      // Only save questions where applies is true directly in evaluationData
      const evaluationData = {
        provider: {
          name: this.providerName,
          nit: this.providerNit,
          type: this.providerType,
          category: this.providerCategory,
          predecessor: this.providerPredecessor
        },
        selectedOption: this.selectedOption,
        questions: this.questions.filter(q => q.applies) // Only questions with applies: true
      };
  
      console.log('Saving evaluation...', evaluationData, 'type' , typeof evaluationData.questions[0].applies);
      this.errorMessage = 'GOOD JOB!!';
    } else {
      this.errorMessage = 'Please complete all required fields';
      console.log('Please complete all required fields');
    }
  }
  
  

  private validateEvaluation(): boolean {
    // Only validate questions that apply
    const applicableQuestions = this.questions.filter(q => q.applies==true);
    return applicableQuestions.length > 0 && applicableQuestions.every(q => q.rating > 0 &&applicableQuestions.every(q => q.applies == true));
  }
}