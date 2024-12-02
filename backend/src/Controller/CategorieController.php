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

        
        $tableauCategories = array_map(function ($categorie) {
            return [
                'id' => $categorie->getId(),
                'nom' => $categorie->getNom(),
            ];
        }, $categories);

        return new JsonResponse([
            'status' => 200,
            'message' => 'Toutes les catégories ont été récupérées.',
            'data' => $tableauCategories,
        ], 200);
    }

    

    #[Route('/{id}', name: 'categorie_show', methods: ['GET'])]
    public function show(Categorie $categorie): JsonResponse
    {
        $tableauCategorie = [
            'id' => $categorie->getId(),
            'nom' => $categorie->getNom(),
        ];

        return new JsonResponse([
            'status' => 200,
            'message' => 'Catégorie récupérée !',
            'data' => $tableauCategorie,
        ], 200);
    }

    #[Route('', name: 'categorie_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator, CategorieRepository $categorieRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['nom']) || empty($data['nom'])) {
            return new JsonResponse([
                'error' => 'Le champ Nom est obligatoire.',
            ], 400);
        }

        $existingCategorie = $categorieRepository->findOneBy(['nom' => $data['nom']]);
        if ($existingCategorie) {
            return new JsonResponse([
                'status' => 400,
                'message' => 'Le nom de la catégorie existe déjà.',
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

        $tableauCategorie = [
            'id' => $categorie->getId(),
            'nom' => $categorie->getNom(),
        ];

        return new JsonResponse([
            'status' => 201,
            'message' => 'Catégorie créée !',
            'data' => $tableauCategorie,
        ], 201);
    }



    #[Route('/{id}', name: 'categorie_edit', methods: ['PUT'])]
    public function edit(Request $request, Categorie $categorie, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['nom']) || empty(trim($data['nom']))) {
            return new JsonResponse([
                'error' => 'Le champ Nom est obligatoire.',
            ], 400);
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

        $tableauCategorie = [
            'id' => $categorie->getId(),
            'nom' => $categorie->getNom(),
        ];

        return new JsonResponse([
            'status' => 200,
            'message' => 'Catégorie mise à jour !',
            'data' => $tableauCategorie,
        ], 200);
    }



    #[Route('/{id}', name: 'categorie_delete', methods: ['DELETE'])]
    public function delete(Categorie $categorie, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($categorie);
        $entityManager->flush();

        return new JsonResponse([
            'status' => 200,
            'message' => 'Catégorie supprimée !',
        ], 200);
    }
}
