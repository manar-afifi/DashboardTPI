import React from "react";
import styled from "styled-components";
import { ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react";

const HeroPage = () => {
    const scrollToFeatures = () => {
        const section = document.getElementById("features");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <Wrapper>
            <Container>
                <Title>
                    Donnez vie à vos données avec <Highlight>des dashboards intelligents</Highlight>
                </Title>
                <Subtitle>
                    Créez quelque chose d'extraordinaire dès aujourd'hui. Nous fournissons les outils et l'expertise dont vous avez besoin pour donner vie à votre vision.
                </Subtitle>
                <Buttons>
                    <PrimaryButton onClick={() => window.location.href = '/login'}>
                        Commencer <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                    </PrimaryButton>
                    <SecondaryButton onClick={scrollToFeatures}>Voir plus</SecondaryButton>
                </Buttons>
            </Container>

            <FeaturesSection id="features">
                <FeatureTitle>Fonctionnalités</FeatureTitle>
                <FeatureHeading>Tout ce dont vous avez besoin</FeatureHeading>
                <FeatureSubtitle>
                    Notre plateforme fournit tous les outils et toutes les fonctionnalités dont vous avez besoin pour réussir.
                </FeatureSubtitle>
                <FeatureCards>
                    <FeatureCard>
                        <IconWrapper><ShieldCheck size={28} /></IconWrapper>
                        <CardTitle>Secure by default</CardTitle>
                        <CardText>Your data is protected with enterprise-grade security.</CardText>
                    </FeatureCard>
                    <FeatureCard>
                        <IconWrapper><Zap size={28} /></IconWrapper>
                        <CardTitle>Lightning fast</CardTitle>
                        <CardText>Optimized performance for the best user experience.</CardText>
                    </FeatureCard>
                    <FeatureCard>
                        <IconWrapper><Heart size={28} /></IconWrapper>
                        <CardTitle>Built with love</CardTitle>
                        <CardText>Crafted with attention to every detail.</CardText>
                    </FeatureCard>
                </FeatureCards>
            </FeaturesSection>
        </Wrapper>
    );
};

export default HeroPage;

const Wrapper = styled.div`
    background: #000000;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding: 80px 20px;
`;

const Container = styled.div`
  max-width: 800px;
  text-align: center;
  margin-bottom: 120px;
`;

const Title = styled.h1`
    font-size: 3rem;
    font-weight: 800;
    color: #f1f3f6;
    line-height: 1.2;
`;

const Highlight = styled.span`
    color: #f603e5;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin: 24px 0 40px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const PrimaryButton = styled.button`
    background-color: #f109ed;
    color: white;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    display: flex;
    align-items: center;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background-color: #d805ec;
    }
`;

const SecondaryButton = styled.button`
    background-color: #e0e7ff;
    color: #f108e6;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        background-color: #c7d2fe;
    }
`;

const FeaturesSection = styled.section`
  max-width: 1100px;
  padding: 60px 20px;
  text-align: center;
`;

const FeatureTitle = styled.div`
    color: #fd08e0;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 12px;
    text-transform: uppercase;
`;

const FeatureHeading = styled.h2`
    font-size: 2rem;
    font-weight: 800;
    color: #f7f9fb;
`;

const FeatureSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin: 16px 0 48px;
`;

const FeatureCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
`;

const FeatureCard = styled.div`
  background-color: #f9f9ff;
  padding: 24px;
  border-radius: 12px;
  width: 250px;
  text-align: left;
`;

const IconWrapper = styled.div`
    background-color: #ea09e8;
    color: white;
    border-radius: 8px;
    padding: 8px;
    display: inline-block;
    margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
`;

const CardText = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  margin-top: 8px;
`;
