<?php

namespace App\Controller;

use App\Entity\Produit;
use App\Repository\ProduitRepository;
use App\Repository\CategorieRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/produit')]
class ProduitController
{
    #[Route('', name: 'produit_index', methods: ['GET'])]
    public function index(ProduitRepository $produitRepository): JsonResponse
    {
        $produits = $produitRepository->findAll();
        return new JsonResponse([
            'status' => 200,
            'message' => 'Tous les produits sont récupérés',
            'data' => $produits,
        ], 200);
    }

    #[Route('/{id}', name: 'produit_show', methods: ['GET'])]
    public function show(Produit $produit): JsonResponse
    {
        return new JsonResponse([
            'status' => 200,
            'message' => 'Produit récupéré',
            'data' => $produit,
        ], 200);
    }

    #[Route('', name: 'produit_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator, CategorieRepository $categorieRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $categorie = $categorieRepository->find($data['categorie_id'] ?? null);
        if (!$categorie) {
            return new JsonResponse(['error' => 'Catégorie introuvable.'], 404);
        }

        $produit = new Produit();
        $produit->setNom($data['nom'] ?? '');
        $produit->setDescription($data['description'] ?? '');
        $produit->setPrix($data['prix'] ?? 0);
        $produit->setCategorie($categorie);
        $produit->setDateCreation(new \DateTime());

        $errors = $validator->validate($produit);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], 400);
        }

        $entityManager->persist($produit);
        $entityManager->flush();

        return new JsonResponse([
            'status' => 201,
            'message' => 'Produit créé !',
            'data' => $produit,
        ], 201);
    }

    #[Route('/{id}', name: 'produit_edit', methods: ['PUT'])]
    public function edit( Request $request, Produit $produit, EntityManagerInterface $entityManager, ValidatorInterface $validator, CategorieRepository $categorieRepository): JsonResponse 
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['categorie_id'])) {
            $categorie = $categorieRepository->find($data['categorie_id']);
            if (!$categorie) {
                return new JsonResponse(['error' => 'Catégorie non trouvée'], 404);
            }
            $produit->setCategorie($categorie);
        }

        $produit->setNom($data['nom'] ?? $produit->getNom());
        $produit->setDescription($data['description'] ?? $produit->getDescription());
        $produit->setPrix($data['prix'] ?? $produit->getPrix());

        $errors = $validator->validate($produit);
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
            'message' => 'Produit mis à jour !',
            'data' => $produit,
        ], 200);
    }

    #[Route('/{id}', name: 'produit_delete', methods: ['DELETE'])]
    public function delete(Produit $produit, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($produit);
        $entityManager->flush();

        return new JsonResponse([
            'status' => 200,
            'message' => 'Produit supprimé !',
        ], 200);
    }
}
    