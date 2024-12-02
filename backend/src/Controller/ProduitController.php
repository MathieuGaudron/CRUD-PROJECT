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

        $tableauProduits = array_map(function ($produit) {
            $categorieNom = null;
            if ($produit->getCategorie()) {
                $categorieNom = $produit->getCategorie()->getNom();
            }

            $dateCreation = null;
            if ($produit->getDateCreation()) {
                $dateCreation = $produit->getDateCreation()->format('Y-m-d H:i:s');
            }

            return [
                'id' => $produit->getId(),
                'nom' => $produit->getNom(),
                'description' => $produit->getDescription(),
                'prix' => $produit->getPrix(),
                'categorie' => $categorieNom,
                'date_creation' => $dateCreation,
            ];
        }, $produits);

        return new JsonResponse([
            'status' => 200,
            'message' => 'Tous les produits sont récupérés',
            'data' => $tableauProduits,
        ], 200);
    }



    #[Route('/{id}', name: 'produit_show', methods: ['GET'])]
    public function show(Produit $produit): JsonResponse
    {
        $categorieNom = null;
        if ($produit->getCategorie()) {
            $categorieNom = $produit->getCategorie()->getNom();
        }

        $dateCreation = null;
        if ($produit->getDateCreation()) {
            $dateCreation = $produit->getDateCreation()->format('Y-m-d H:i:s');
        }

        $tableauProduit = [
            'id' => $produit->getId(),
            'nom' => $produit->getNom(),
            'description' => $produit->getDescription(),
            'prix' => $produit->getPrix(),
            'categorie' => $categorieNom,
            'date_creation' => $dateCreation,
        ];

        return new JsonResponse([
            'status' => 200,
            'message' => 'Produit récupéré',
            'data' => $tableauProduit,
        ], 200);
    }



    #[Route('', name: 'produit_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, ValidatorInterface $validator, CategorieRepository $categorieRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $categorie = $categorieRepository->find($data['categorie_id']);
        if (!$categorie) {
            return new JsonResponse(['error' => 'Catégorie introuvable.'], 404);
        }

        $produit = new Produit();

        if (isset($data['nom'])) {
            $produit->setNom($data['nom']);
        } else {
            return new JsonResponse(['error' => 'Le champ nom est obligatoire.'], 400);
        }

        if (isset($data['description'])) {
            $produit->setDescription($data['description']);
        } else {
            return new JsonResponse(['error' => 'Le champ description est obligatoire.'], 400);
        }

        if (isset($data['prix'])) {
            $produit->setPrix($data['prix']);
        } else {
            return new JsonResponse(['error' => 'Le champ prix est obligatoire.'], 400);
        }

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

        $tableauProduit = [
            'id' => $produit->getId(),
            'nom' => $produit->getNom(),
            'description' => $produit->getDescription(),
            'prix' => $produit->getPrix(),
            'categorie' => $produit->getCategorie()->getNom(),
            'date_creation' => $produit->getDateCreation()->format('Y-m-d H:i:s'),
        ];

        return new JsonResponse([
            'status' => 201,
            'message' => 'Produit créé !',
            'data' => $tableauProduit,
        ], 201);
    }




    #[Route('/{id}', name: 'produit_edit', methods: ['PUT'])]
    public function edit(Request $request, Produit $produit, EntityManagerInterface $entityManager, ValidatorInterface $validator, CategorieRepository $categorieRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['categorie_id'])) {
            $categorie = $categorieRepository->find($data['categorie_id']);
            if (!$categorie) {
                return new JsonResponse(['error' => 'Catégorie non trouvée'], 404);
            }
            $produit->setCategorie($categorie);
        }

        if (isset($data['nom'])) {
            $produit->setNom($data['nom']);
        }

        if (isset($data['description'])) {
            $produit->setDescription($data['description']);
        }

        if (isset($data['prix'])) {
            $produit->setPrix($data['prix']);
        }

        $errors = $validator->validate($produit);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], 400);
        }

        $entityManager->flush();

        $categorieNom = null;
        if ($produit->getCategorie()) {
            $categorieNom = $produit->getCategorie()->getNom();
        }

        $dateCreation = null;
        if ($produit->getDateCreation()) {
            $dateCreation = $produit->getDateCreation()->format('Y-m-d H:i:s');
        }

        $tableauProduit = [
            'id' => $produit->getId(),
            'nom' => $produit->getNom(),
            'description' => $produit->getDescription(),
            'prix' => $produit->getPrix(),
            'categorie' => $categorieNom,
            'date_creation' => $dateCreation,
        ];

        return new JsonResponse([
            'status' => 200,
            'message' => 'Produit mis à jour !',
            'data' => $tableauProduit,
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
