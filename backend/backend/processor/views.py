from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings as django_settings
from django.views.decorators.csrf import csrf_exempt
from jmetal.algorithm.singleobjective.genetic_algorithm import GeneticAlgorithm
from jmetal.operator import BinaryTournamentSelection
from jmetal.operator.crossover import PMXCrossover
from jmetal.operator.mutation import PermutationSwapMutation
from jmetal.problem.singleobjective.tsp import TSP
from jmetal.util.comparator import MultiComparator
from jmetal.util.density_estimator import CrowdingDistance
from jmetal.util.ranking import FastNonDominatedRanking
from jmetal.util.termination_criterion import StoppingByEvaluations
from processor.resources.tsp_problem import CENARIO1
import numpy
import os
import pathlib
import json 


# Create your views here. localhost:8000/process
@csrf_exempt
def process(request):
  #if request.method == 'POST':
    # organize parameters to send to algorithm
      # implement a switch to know which algorithm to execute
    json_data = json.loads(request.body)
    solution = cenario1(json_data)
    return JsonResponse(json.dumps(solution), safe=False)

def cenario1(data: dict):
  problem = CENARIO1(instance=data)
  print('Cities: ', problem.number_of_variables)

  algorithm = GeneticAlgorithm(
      problem=problem,
      population_size=100,
      offspring_population_size=100,
      mutation=PermutationSwapMutation(1.0 / problem.number_of_variables),
      crossover=PMXCrossover(0.8),
      selection=BinaryTournamentSelection(
          MultiComparator([FastNonDominatedRanking.get_comparator(),
                              CrowdingDistance.get_comparator()])),
      termination_criterion=StoppingByEvaluations(max_evaluations=2500000)
  )

  algorithm.run()
  result = algorithm.get_result()

  array = [None] * len(result.variables)
  for i in range(len(result.variables)):
      array[i] = data["index"].get(str(result.variables[i] + 1 ))

  array_nodes = numpy.array(result.variables) + 1
  print('Algorithm: {}'.format(algorithm.get_name()))
  print('Problem: {}'.format(problem.get_name()))
  print('Solution: {}'.format(array_nodes.tolist()))
  print("Final Solution: ", array)
  print('Fitness: {}'.format(result.objectives[0]))
  print('Computing time: {}'.format(algorithm.total_computing_time))
  return array


""" problem = ZDT1()

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
  #plot_front.plot(front, label='NSGAII-ZDT1', filename=path_toString, format='png') """