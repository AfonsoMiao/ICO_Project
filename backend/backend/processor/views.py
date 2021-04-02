from django.shortcuts import render
from django.http import HttpResponse
import json
from jmetal.algorithm.multiobjective import NSGAII
from jmetal.operator import SBXCrossover, PolynomialMutation
from jmetal.problem import ZDT1
from jmetal.util.termination_criterion import StoppingByEvaluations
from jmetal.util.solution import get_non_dominated_solutions, print_function_values_to_file, print_variables_to_file
from jmetal.lab.visualization import Plot
import os 
from django.conf import settings as django_settings
import pathlib


# Create your views here. localhost:8000/process
def process(request):
  #if request.method == 'POST':
    #json_data = json.loads(request.body)
    # organize parameters to send to algorithm
      # implement a switch to know which algorithm to execute
    path = testing_algorithm()
    return HttpResponse(path)

def testing_algorithm():
  problem = ZDT1()

  algorithm = NSGAII(
      problem=problem,
      population_size=100,
      offspring_population_size=100,
      mutation=PolynomialMutation(probability=1.0 / problem.number_of_variables, distribution_index=20),
      crossover=SBXCrossover(probability=1.0, distribution_index=20),
      termination_criterion=StoppingByEvaluations(max_evaluations=25000)
  )

  algorithm.run()

  front = get_non_dominated_solutions(algorithm.get_result())

  # save to files
  print_function_values_to_file(front, 'FUN.NSGAII.ZDT1')
  print_variables_to_file(front, 'VAR.NSGAII.ZDT1')

  path = str(pathlib.Path().absolute()).replace("backend\\backend", "frontend\\src\\images\\TESTE3")
  plot_front = Plot(title='Pareto front approximation', axis_labels=['x', 'y'])
  plot_front.plot(front, label='NSGAII-ZDT1', filename=path, format='png')
  #plot_front.plot(front, label='NSGAII-ZDT1', filename=path_toString, format='png')
  return path