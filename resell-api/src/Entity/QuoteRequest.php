<?php

namespace App\Entity;

use App\Repository\QuoteRequestRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QuoteRequestRepository::class)]
class QuoteRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $customerEmail = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?PhoneModel $phoneModel = null;

    #[ORM\Column]
    private ?bool $hasDamage = null;

    #[ORM\Column]
    private ?bool $hasReplacedParts = null;

    #[ORM\Column]
    private ?int $estimatedPrice = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCustomerEmail(): ?string
    {
        return $this->customerEmail;
    }

    public function setCustomerEmail(string $customerEmail): static
    {
        $this->customerEmail = $customerEmail;

        return $this;
    }

    public function getPhoneModel(): ?PhoneModel
    {
        return $this->phoneModel;
    }

    public function setPhoneModel(?PhoneModel $phoneModel): static
    {
        $this->phoneModel = $phoneModel;

        return $this;
    }

    public function hasDamage(): ?bool
    {
        return $this->hasDamage;
    }

    public function setHasDamage(bool $hasDamage): static
    {
        $this->hasDamage = $hasDamage;

        return $this;
    }

    public function hasReplacedParts(): ?bool
    {
        return $this->hasReplacedParts;
    }

    public function setHasReplacedParts(bool $hasReplacedParts): static
    {
        $this->hasReplacedParts = $hasReplacedParts;

        return $this;
    }

    public function getEstimatedPrice(): ?int
    {
        return $this->estimatedPrice;
    }

    public function setEstimatedPrice(int $estimatedPrice): static
    {
        $this->estimatedPrice = $estimatedPrice;

        return $this;
    }
}
