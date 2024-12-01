<?php

namespace App\Controller;

use App\Entity\Categorie;
use App\Repository\CategorieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/categorie')]
class CategorieController
{
    #[Route('', name: 'categorie_index', methods: ['GET'])]
    public function index(CategorieRepository $categorieRepository): JsonResponse
    {
        $categories = $categorieRepository->findAll();
        
        return new JsonResponse([
            'status' => 200,
            'message' => 'Toutes les categories ont ete recuperees',
            'data' => $categories,
        ], 200);
    }

    #[Route('/{id}', name: 'categorie_show', methods: ['GET'])]
    public function show(Categorie $categorie): JsonResponse
    {
        return new JsonResponse([
            'status' => 200,
            'message' => 'Categorie recuperee !',
            'data' => $categorie,
        ], 200);
    }



    #[Route('', name: 'categorie_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator, CategorieRepository $categorieRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        if (!isset($data['nom']) || empty($data['nom'])) {
            return new JsonResponse([
                'error' => 'Le champ Nom est obligatoire.'
            ], 400);
        }
    
        $existingCategorie = $categorieRepository->findOneBy(['nom' => $data['nom']]);
        if ($existingCategorie) {
            return new JsonResponse([
                'status' => 400,
                'message' => 'Le nom de la categorie existe déjà.',
            ], 400);
        }
    
        $categorie = new Categorie();
        $categorie->setNom($data['nom']);
    
        $errors = $validator->validate($categorie);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], 400);
        }
        $entityManager->persist($categorie);
        $entityManager->flush();
    
        return new JsonResponse([
            'status' => 201,
            'message' => 'Categorie creee !',
            'data' => $categorie,
        ], 201);
    }
    


    #[Route('/{id}', name: 'categorie_edit', methods: ['PUT'])]
    public function edit(Request $request, Categorie $categorie, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        if (!$categorie) {
            return new JsonResponse([
                'error' => 'Categorie non trouvee.'
            ], 404);
        }
    
        $data = json_decode($request->getContent(), true);
    
        if (!isset($data['nom']) || empty(trim($data['nom']))) {
            return new JsonResponse(['error' => 'Le champ Nom est obligatoire'], 400);
        }
    
        $categorie->setNom($data['nom']);

        $errors = $validator->validate($categorie);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], 400);
        }
        $entityManager->flush();

        return new JsonResponse([
            'status' => 200,
            'message' => 'Categorie mise a jour !',
            'data' => $categorie,
        ], 200);
    }
    

    #[Route('/{id}', name: 'categorie_delete', methods: ['DELETE'])]
    public function delete(Categorie $categorie, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($categorie);
        $entityManager->flush();

        return new JsonResponse([
            'status' => 200,
            'message' => 'Categorie supprimee !',
        ], 200);
    }
}