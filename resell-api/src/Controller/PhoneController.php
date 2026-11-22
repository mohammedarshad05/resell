<?php

namespace App\Controller;

use App\Repository\PhoneModelRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class PhoneController extends AbstractController
{
    #[Route('/api/phones', name: 'api_phones_list', methods: ['GET'])]
    public function index(PhoneModelRepository $phoneRepository): JsonResponse
    {
        $phones = $phoneRepository->findAll();

        $data = array_map(fn($phone) => [
            'id' => $phone->getId(),
            'brand' => $phone->getBrand(),
            'modelName' => $phone->getModelName(),
            'basePrice' => $phone->getBasePrice(),
        ], $phones);

        return $this->json($data);
    }
}