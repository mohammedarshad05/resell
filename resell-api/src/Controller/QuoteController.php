<?php

namespace App\Controller;

use App\Entity\QuoteRequest;
use App\Repository\PhoneModelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class QuoteController extends AbstractController
{
    #[Route('/api/quotes', name: 'api_quotes_create', methods: ['POST'])]
    public function create(
        Request $request,
        PhoneModelRepository $phoneRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true);

        if (!$payload || empty($payload['phoneModelId']) || empty($payload['customerEmail'])) {
            return $this->json(['error' => 'phoneModelId and customerEmail are required'], 400);
        }

        $phone = $phoneRepository->find($payload['phoneModelId']);
        if (!$phone) {
            return $this->json(['error' => 'Phone model not found'], 404);
        }

        $hasDamage = (bool) ($payload['hasDamage'] ?? false);
        $hasReplacedParts = (bool) ($payload['hasReplacedParts'] ?? false);

        // Start from basePrice and apply condition deductions
        $estimatedPrice = $phone->getBasePrice();
        if ($hasDamage) {
            $estimatedPrice = (int) round($estimatedPrice * 0.70); // -30% for screen/body damage
        }
        if ($hasReplacedParts) {
            $estimatedPrice = (int) round($estimatedPrice * 0.85); // -15% for replaced parts
        }

        $quote = new QuoteRequest();
        $quote->setCustomerEmail($payload['customerEmail']);
        $quote->setPhoneModel($phone);
        $quote->setHasDamage($hasDamage);
        $quote->setHasReplacedParts($hasReplacedParts);
        $quote->setEstimatedPrice($estimatedPrice);

        $entityManager->persist($quote);
        $entityManager->flush();

        return $this->json([
            'id' => $quote->getId(),
            'phone' => $phone->getBrand() . ' ' . $phone->getModelName(),
            'basePrice' => $phone->getBasePrice(),
            'hasDamage' => $hasDamage,
            'hasReplacedParts' => $hasReplacedParts,
            'estimatedPrice' => $estimatedPrice,
        ], 201);
    }
}